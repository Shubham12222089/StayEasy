namespace BookingService.Application.Events;

public class BookingCreatedEvent
{
    public int BookingId { get; set; }
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
}
