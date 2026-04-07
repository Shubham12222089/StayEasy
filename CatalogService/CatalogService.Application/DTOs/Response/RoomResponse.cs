namespace CatalogService.Application.DTOs.Response;

public class RoomResponse
{
    public int Id { get; set; }

    public int HotelId { get; set; }

    public string Type { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int AvailableCount { get; set; }
}
