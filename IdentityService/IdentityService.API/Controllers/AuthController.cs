using IdentityService.Application.DTOs.Request;
using IdentityService.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup(SignupRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        return Ok(result);
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(VerifyEmailRequest request)
    {
        await _authService.VerifyEmailAsync(request.Email, request.Otp);
        return Ok("Email verified");
    }

    [HttpPost("resend-otp")]
    public async Task<IActionResult> ResendOtp(ResendOtpRequest request)
    {
        await _authService.ResendOtpAsync(request.Email);
        return Ok("OTP sent");
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult GetMe()
    {
        return Ok("You are authorized!");
    }
}