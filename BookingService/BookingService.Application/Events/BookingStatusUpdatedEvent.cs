namespace BookingService.Application.Events;

public class BookingStatusUpdatedEvent
{
    public int BookingId { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; } = string.Empty;
}
