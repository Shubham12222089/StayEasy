namespace BookingService.Application.DTOs.Request;

public class AddToCartRequest
{
    public int HotelId { get; set; }

    public int Quantity { get; set; }
}