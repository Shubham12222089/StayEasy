namespace IdentityService.Domain.Entities;

public class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = "Guest"; // Guest / Admin

    public bool IsBlocked { get; set; }

    public bool IsEmailVerified { get; set; }

    public string? VerificationToken { get; set; }

    public string? EmailOtp { get; set; }

    public DateTime? OtpExpiresAt { get; set; }

    public string? PasswordResetOtp { get; set; }

    public DateTime? PasswordResetExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}