namespace IdentityService.Domain.Entities;

public class RevokedToken
{
    public int Id { get; set; }
    public string Jti { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
