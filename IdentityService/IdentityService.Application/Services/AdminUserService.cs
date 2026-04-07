using IdentityService.Application.DTOs.Response;
using IdentityService.Application.Exceptions;
using IdentityService.Application.Interfaces.Services;
using IdentityService.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;

namespace IdentityService.Application.Services;

public class AdminUserService : IAdminUserService
{
    private readonly UserRepository _userRepository;

    public AdminUserService(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<UserResponse>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();

        return users.Select(u => new UserResponse
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email,
            Role = u.Role,
            IsBlocked = u.IsBlocked,
            CreatedAt = u.CreatedAt
        }).ToList();
    }

    public async Task<UserResponse?> GetUserByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user == null) return null;

        return new UserResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role,
            IsBlocked = user.IsBlocked,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task DeleteUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user == null)
            throw new ApiException("User not found", StatusCodes.Status404NotFound);

        await _userRepository.DeleteAsync(user);
    }

    public async Task SetUserBlockedAsync(int id, bool isBlocked)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user == null)
            throw new ApiException("User not found", StatusCodes.Status404NotFound);

        user.IsBlocked = isBlocked;
        await _userRepository.SaveChangesAsync();
    }
}
