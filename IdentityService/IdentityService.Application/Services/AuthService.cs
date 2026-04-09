using IdentityService.Application.DTOs.Request;
using IdentityService.Application.DTOs.Response;
using IdentityService.Application.Events;
using IdentityService.Application.Exceptions;
using IdentityService.Application.Interfaces.Services;
using IdentityService.Domain.Entities;
using IdentityService.Infrastructure.Messaging;
using IdentityService.Infrastructure.Repositories;
using IdentityService.Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;

namespace IdentityService.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserRepository _userRepository;
    private readonly PasswordHasher _passwordHasher;
    private readonly JwtService _jwtService;
    private readonly IEmailSender _emailSender;
    private readonly IConfiguration _configuration;
    private readonly RevokedTokenRepository _revokedTokenRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly RabbitMQPublisher _rabbitMqPublisher;

    public AuthService(UserRepository userRepository,
                       PasswordHasher passwordHasher,
                       JwtService jwtService,
                       IEmailSender emailSender,
                       IConfiguration configuration,
                       RevokedTokenRepository revokedTokenRepository,
                       IHttpContextAccessor httpContextAccessor,
                       RabbitMQPublisher rabbitMqPublisher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
        _emailSender = emailSender;
        _configuration = configuration;
        _revokedTokenRepository = revokedTokenRepository;
        _httpContextAccessor = httpContextAccessor;
        _rabbitMqPublisher = rabbitMqPublisher;
    }

    public async Task<AuthResponse> RegisterAsync(SignupRequest request)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);

        if (existingUser != null)
            throw new ApiException("User already exists", StatusCodes.Status400BadRequest);

        var otp = GenerateOtp();

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = "Guest",
            IsEmailVerified = false,
            VerificationToken = null,
            EmailOtp = otp,
            OtpExpiresAt = DateTime.UtcNow.AddMinutes(10)
        };

        await _userRepository.AddAsync(user);

        await _emailSender.SendEmailAsync(
            user.Email,
            "Verify your email",
            $"Your verification OTP is: {otp}");

        var token = _jwtService.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new ApiException("Invalid credentials", StatusCodes.Status401Unauthorized);

        if (user.IsBlocked)
            throw new ApiException("User is blocked", StatusCodes.Status403Forbidden);

        if (!user.IsEmailVerified)
            throw new ApiException("Verify email first", StatusCodes.Status403Forbidden);

        var token = _jwtService.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task VerifyEmailAsync(string email, string otp)
    {
        var user = await _userRepository.GetByEmailAsync(email);

        if (user == null)
            throw new ApiException("Invalid email", StatusCodes.Status400BadRequest);

        if (user.EmailOtp == null || user.OtpExpiresAt == null)
            throw new ApiException("OTP not found", StatusCodes.Status400BadRequest);

        if (user.OtpExpiresAt < DateTime.UtcNow)
            throw new ApiException("OTP expired", StatusCodes.Status400BadRequest);

        if (!string.Equals(user.EmailOtp, otp, StringComparison.Ordinal))
            throw new ApiException("Invalid OTP", StatusCodes.Status400BadRequest);

        user.IsEmailVerified = true;
        user.VerificationToken = null;
        user.EmailOtp = null;
        user.OtpExpiresAt = null;

        await _userRepository.SaveChangesAsync();
    }

    public async Task ResendOtpAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);

        if (user == null)
            throw new ApiException("Invalid email", StatusCodes.Status400BadRequest);

        if (user.IsEmailVerified)
            throw new ApiException("Email already verified", StatusCodes.Status400BadRequest);

        var otp = GenerateOtp();
        user.EmailOtp = otp;
        user.OtpExpiresAt = DateTime.UtcNow.AddMinutes(10);

        await _userRepository.SaveChangesAsync();

        await _emailSender.SendEmailAsync(
            user.Email,
            "Verify your email",
            $"Your verification OTP is: {otp}");
    }

    public async Task RequestPasswordResetAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);

        if (user == null)
            throw new ApiException("Invalid email", StatusCodes.Status400BadRequest);

        var otp = GenerateOtp();
        user.PasswordResetOtp = otp;
        user.PasswordResetExpiresAt = DateTime.UtcNow.AddMinutes(10);

        await _userRepository.SaveChangesAsync();

        await _emailSender.SendEmailAsync(
            user.Email,
            "Reset your password",
            $"Your password reset OTP is: {otp}");
    }

    public async Task ResetPasswordAsync(string email, string otp, string newPassword)
    {
        var user = await _userRepository.GetByEmailAsync(email);

        if (user == null)
            throw new ApiException("Invalid email", StatusCodes.Status400BadRequest);

        if (user.PasswordResetOtp == null || user.PasswordResetExpiresAt == null)
            throw new ApiException("OTP not found", StatusCodes.Status400BadRequest);

        if (user.PasswordResetExpiresAt < DateTime.UtcNow)
            throw new ApiException("OTP expired", StatusCodes.Status400BadRequest);

        if (!string.Equals(user.PasswordResetOtp, otp, StringComparison.Ordinal))
            throw new ApiException("Invalid OTP", StatusCodes.Status400BadRequest);

        user.PasswordHash = _passwordHasher.Hash(newPassword);
        user.PasswordResetOtp = null;
        user.PasswordResetExpiresAt = null;

        await _userRepository.SaveChangesAsync();
    }

    public async Task LogoutAsync()
    {
        var authorization = _httpContextAccessor.HttpContext?.Request.Headers.Authorization.ToString();

        if (string.IsNullOrWhiteSpace(authorization) || !authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            return;

        var tokenValue = authorization["Bearer ".Length..].Trim();
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(tokenValue);
        var jti = token.Id;

        if (string.IsNullOrWhiteSpace(jti))
            return;

        await _revokedTokenRepository.AddAsync(new RevokedToken
        {
            Jti = jti,
            ExpiresAt = token.ValidTo
        });

        await _rabbitMqPublisher.PublishAsync("logout_event", new LogoutEvent
        {
            Jti = jti,
            ExpiresAt = token.ValidTo
        });
    }

    private static string GenerateOtp()
    {
        return Random.Shared.Next(100000, 999999).ToString();
    }
}