namespace BookingService.Application.Events;

public class CartCheckedOutEvent
{
    public int UserId { get; set; }
    public int ItemCount { get; set; }
    public decimal TotalAmount { get; set; }
}
