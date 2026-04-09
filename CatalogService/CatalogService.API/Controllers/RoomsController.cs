using CatalogService.Application.DTOs.Request;
using CatalogService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CatalogService.API.Controllers;

[ApiController]
[Route("api/rooms")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet("hotel/{hotelId}")]
    public async Task<IActionResult> GetByHotel(Guid hotelId)
    {
        var result = await _roomService.GetRoomsByHotelAsync(hotelId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _roomService.GetRoomByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AddRoom(CreateRoomRequest request)
    {
        await _roomService.AddRoomAsync(request);
        return Ok("Room added");
    }

    [HttpPut("{id}/reserve")]
    public async Task<IActionResult> ReserveRoom(Guid id, ReserveRoomRequest request)
    {
        await _roomService.ReserveRoomAsync(id, request.Quantity);
        return Ok("Room reserved");
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRoom(Guid id, UpdateRoomRequest request)
    {
        await _roomService.UpdateRoomAsync(id, request);
        return Ok("Room updated");
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRoom(Guid id)
    {
        await _roomService.DeleteRoomAsync(id);
        return Ok("Room deleted");
    }
}
