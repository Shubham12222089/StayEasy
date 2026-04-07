namespace CatalogService.Domain.Entities;

public class Room
{
    public int Id { get; set; }

    public int HotelId { get; set; }

    public string Type { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int AvailableCount { get; set; }
}
