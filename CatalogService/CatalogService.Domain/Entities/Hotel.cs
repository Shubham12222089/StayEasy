namespace CatalogService.Domain.Entities;

public class Hotel
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal PricePerNight { get; set; }

    public decimal Rating { get; set; }

    public int AvailableRooms { get; set; }

    public List<Room> Rooms { get; set; } = new();
}