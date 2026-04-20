namespace AdminService.Domain.DTOs.Request;

public class UpdateRoomRequest
{
    public string Type { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int AvailableCount { get; set; }
}
