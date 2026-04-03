using BookingService.Application.DTOs.Request;
using BookingService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookingService.API.Controllers;

[ApiController]
[Route("api/booking")]
[Authorize]
public class BookingController : ControllerBase
{
    private readonly IBookingService _service;

    public BookingController(IBookingService service)
    {
        _service = service;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [HttpPost("cart")]
    public async Task<IActionResult> AddToCart(AddToCartRequest request)
    {
        await _service.AddToCartAsync(GetUserId(), request);
        return Ok("Added to cart");
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout()
    {
        await _service.CheckoutAsync(GetUserId());
        return Ok("Booking confirmed");
    }

    [HttpGet("my-bookings")]
    public async Task<IActionResult> GetMyBookings()
    {
        var bookings = await _service.GetUserBookingsAsync(GetUserId());
        return Ok(bookings);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllBookings()
    {
        var bookings = await _service.GetAllBookingsAsync();
        return Ok(bookings);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateBookingStatusRequest request)
    {
        await _service.UpdateBookingStatusAsync(id, request.Status);
        return Ok("Status updated");
    }
}