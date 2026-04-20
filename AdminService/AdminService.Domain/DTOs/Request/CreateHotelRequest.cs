namespace AdminService.Domain.DTOs.Request;

public class CreateHotelRequest
{
    public string Name { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal PricePerNight { get; set; }

    public int AvailableRooms { get; set; }
}
