namespace BookingService.Application.DTOs.Request;

public class AddToCartRequest
{
    public int RoomId { get; set; }

    public int Quantity { get; set; }
}