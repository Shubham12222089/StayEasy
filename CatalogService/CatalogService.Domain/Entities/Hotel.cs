namespace CatalogService.Domain.Entities;

public class Hotel
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal PricePerNight { get; set; }

    public int AvailableRooms { get; set; }
}