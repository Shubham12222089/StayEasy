using IdentityService.Application.DTOs.Request;
using IdentityService.Application.DTOs.Response;

namespace IdentityService.Application.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(SignupRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task VerifyEmailAsync(string email, string otp);
    Task ResendOtpAsync(string email);
}