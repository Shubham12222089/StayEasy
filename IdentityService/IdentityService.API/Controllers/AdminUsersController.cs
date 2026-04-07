using IdentityService.Application.DTOs.Request;
using IdentityService.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.API.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly IAdminUserService _adminUserService;

    public AdminUsersController(IAdminUserService adminUserService)
    {
        _adminUserService = adminUserService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _adminUserService.GetAllUsersAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _adminUserService.GetUserByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _adminUserService.DeleteUserAsync(id);
        return Ok("User deleted");
    }

    [HttpPut("{id}/block")]
    public async Task<IActionResult> Block(int id, UpdateUserBlockRequest request)
    {
        await _adminUserService.SetUserBlockedAsync(id, request.IsBlocked);
        return Ok("User updated");
    }
}
