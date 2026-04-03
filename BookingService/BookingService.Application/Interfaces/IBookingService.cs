using BookingService.Application.DTOs.Request;
using BookingService.Domain.Entities;

namespace BookingService.Application.Interfaces;

public interface IBookingService
{
    Task AddToCartAsync(int userId, AddToCartRequest request);

    Task CheckoutAsync(int userId);

    Task<List<Booking>> GetUserBookingsAsync(int userId);

    Task<List<Booking>> GetAllBookingsAsync();
}