namespace CatalogService.Application.DTOs.Response;

public class HotelResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public decimal PricePerNight { get; set; }
}