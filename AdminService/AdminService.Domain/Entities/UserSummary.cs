namespace AdminService.Domain.Entities;

public class UserSummary
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public bool IsBlocked { get; set; }

    public DateTime CreatedAt { get; set; }
}
