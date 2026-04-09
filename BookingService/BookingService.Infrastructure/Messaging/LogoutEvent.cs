namespace BookingService.Infrastructure.Messaging;

public class LogoutEvent
{
    public string Jti { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
