namespace BookingService.Application.Events;

public class CartPendingEvent
{
    public int UserId { get; set; }
    public Guid RoomId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}
