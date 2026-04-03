using AdminService.Domain.Entities;

namespace AdminService.Application.Interfaces;

public interface IAdminService
{
    Task<List<BookingSummary>> GetAllBookingsAsync();

    Task UpdateBookingStatusAsync(int bookingId, string status);
}