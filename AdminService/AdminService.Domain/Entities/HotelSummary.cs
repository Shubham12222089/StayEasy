namespace AdminService.Domain.Entities;

public class HotelSummary
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public decimal PricePerNight { get; set; }
}
