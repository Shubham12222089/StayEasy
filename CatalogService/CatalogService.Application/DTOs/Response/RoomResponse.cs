namespace CatalogService.Application.DTOs.Response;

public class RoomResponse
{
    public Guid Id { get; set; }

    public Guid HotelId { get; set; }

    public string Type { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int AvailableCount { get; set; }
}
