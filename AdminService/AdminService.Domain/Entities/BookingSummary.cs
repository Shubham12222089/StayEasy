namespace AdminService.Domain.Entities;

public class BookingSummary
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;
}