namespace BookingService.Application.DTOs.Request;

public class AddToCartRequest
{
    public Guid RoomId { get; set; }

    public int Quantity { get; set; }
}