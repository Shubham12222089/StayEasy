namespace CatalogService.Application.DTOs.Response;

public class HotelResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public decimal PricePerNight { get; set; }

    public decimal Rating { get; set; }

    public List<RoomResponse> Rooms { get; set; } = new();
}