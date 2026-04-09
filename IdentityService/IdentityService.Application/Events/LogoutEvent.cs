namespace IdentityService.Application.Events;

public class LogoutEvent
{
    public string Jti { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
