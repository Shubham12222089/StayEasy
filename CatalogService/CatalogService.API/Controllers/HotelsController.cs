using CatalogService.Application.DTOs.Request;
using CatalogService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CatalogService.API.Controllers;

[ApiController]
[Route("api/hotels")]
public class HotelsController : ControllerBase
{
    private readonly IHotelService _hotelService;

    public HotelsController(IHotelService hotelService)
    {
        _hotelService = hotelService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _hotelService.GetAllHotelsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _hotelService.GetHotelByIdAsync(id);

        if (result == null) return NotFound();

        return Ok(result);
    }


    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AddHotel(CreateHotelRequest request)
    {
        await _hotelService.AddHotelAsync(request);
        return Ok("Hotel added");
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHotel(int id, UpdateHotelRequest request)
    {
        await _hotelService.UpdateHotelAsync(id, request);
        return Ok("Hotel updated");
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHotel(int id)
    {
        await _hotelService.DeleteHotelAsync(id);
        return Ok("Hotel deleted");
    }
}