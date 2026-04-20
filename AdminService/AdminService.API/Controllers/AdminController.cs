using AdminService.Application.DTOs.Request;
using AdminService.Application.Interfaces;
using AdminService.Domain.DTOs.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdminService.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _service;

    public AdminController(IAdminService service)
    {
        _service = service;
    }

    [HttpGet("bookings")]
    public async Task<IActionResult> GetAllBookings()
    {
        var result = await _service.GetAllBookingsAsync();
        return Ok(result);
    }

    [HttpPut("bookings/{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateBookingStatusRequest request)
    {
        await _service.UpdateBookingStatusAsync(id, request.Status);
        return Ok("Booking status updated");
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var result = await _service.GetUsersAsync();
        return Ok(result);
    }

    [HttpPut("users/{id}/block")]
    public async Task<IActionResult> BlockUser(int id, [FromBody] UpdateUserBlockRequest request)
    {
        await _service.BlockUserAsync(id, request.IsBlocked);
        return Ok("User updated");
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await _service.DeleteUserAsync(id);
        return Ok("User deleted");
    }

    [HttpGet("hotels")]
    public async Task<IActionResult> GetHotels()
    {
        var result = await _service.GetHotelsAsync();
        return Ok(result);
    }

    [HttpPost("hotels")]
    public async Task<IActionResult> AddHotel([FromBody] CreateHotelRequest request)
    {
        await _service.AddHotelAsync(request);
        return Ok("Hotel added");
    }

    [HttpPut("hotels/{id}")]
    public async Task<IActionResult> UpdateHotel(Guid id, [FromBody] UpdateHotelRequest request)
    {
        await _service.UpdateHotelAsync(id, request);
        return Ok("Hotel updated");
    }

    [HttpDelete("hotels/{id}")]
    public async Task<IActionResult> DeleteHotel(Guid id)
    {
        await _service.DeleteHotelAsync(id);
        return Ok("Hotel deleted");
    }

    [HttpGet("rooms/hotel/{hotelId}")]
    public async Task<IActionResult> GetRoomsByHotel(Guid hotelId)
    {
        var result = await _service.GetRoomsByHotelAsync(hotelId);
        return Ok(result);
    }

    [HttpPost("rooms")]
    public async Task<IActionResult> AddRoom([FromBody] CreateRoomRequest request)
    {
        await _service.AddRoomAsync(request);
        return Ok("Room added");
    }

    [HttpPut("rooms/{id}")]
    public async Task<IActionResult> UpdateRoom(Guid id, [FromBody] UpdateRoomRequest request)
    {
        await _service.UpdateRoomAsync(id, request);
        return Ok("Room updated");
    }

    [HttpDelete("rooms/{id}")]
    public async Task<IActionResult> DeleteRoom(Guid id)
    {
        await _service.DeleteRoomAsync(id);
        return Ok("Room deleted");
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var result = await _service.GetDashboardStatsAsync();
        return Ok(result);
    }
}