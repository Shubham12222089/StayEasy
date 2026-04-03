using IdentityService.Application.DTOs.Request;
using IdentityService.Application.DTOs.Response;
using IdentityService.Application.Interfaces.Services;
using IdentityService.Domain.Entities;
using IdentityService.Infrastructure.Repositories;
using IdentityService.Infrastructure.Services;

namespace IdentityService.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserRepository _userRepository;
    private readonly PasswordHasher _passwordHasher;
    private readonly JwtService _jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordHasher passwordHasher,
                       JwtService jwtService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> RegisterAsync(SignupRequest request)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);

        if (existingUser != null)
            throw new Exception("User already exists");

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = "Guest"
        };

        await _userRepository.AddAsync(user);

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
            throw new Exception("Invalid credentials");

        var token = _jwtService.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            Role = user.Role
        };
    }
}