namespace CatalogService.Application.DTOs.Request;

public class UpdateHotelRequest
{
    public string Name { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal PricePerNight { get; set; }

    public int AvailableRooms { get; set; }
}
