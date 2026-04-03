using AdminService.Application.Interfaces;
using AdminService.Domain.Entities;
using AdminService.Infrastructure.Services;

namespace AdminService.Application.Services;

public class AdminService : IAdminService
{
    private readonly BookingClient _bookingClient;

    public AdminService(BookingClient bookingClient)
    {
        _bookingClient = bookingClient;
    }

    public async Task<List<BookingSummary>> GetAllBookingsAsync()
    {
        return await _bookingClient.GetAllBookings();
    }

    public async Task UpdateBookingStatusAsync(int bookingId, string status)
    {
        await _bookingClient.UpdateBookingStatus(bookingId, status);
    }
}