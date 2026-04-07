using IdentityService.Application.DTOs.Response;

namespace IdentityService.Application.Interfaces.Services;

public interface IAdminUserService
{
    Task<List<UserResponse>> GetAllUsersAsync();

    Task<UserResponse?> GetUserByIdAsync(int id);

    Task DeleteUserAsync(int id);

    Task SetUserBlockedAsync(int id, bool isBlocked);
}
