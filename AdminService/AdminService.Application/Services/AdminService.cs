using AdminService.Application.Interfaces;
using AdminService.Domain.Entities;
using AdminService.Infrastructure.Services;

namespace AdminService.Application.Services;

public class AdminService : IAdminService
{
    private readonly BookingClient _bookingClient;
    private readonly IdentityClient _identityClient;
    private readonly CatalogClient _catalogClient;

    public AdminService(BookingClient bookingClient, IdentityClient identityClient, CatalogClient catalogClient)
    {
        _bookingClient = bookingClient;
        _identityClient = identityClient;
        _catalogClient = catalogClient;
    }

    public async Task<List<BookingSummary>> GetAllBookingsAsync()
    {
        return await _bookingClient.GetAllBookings();
    }

    public async Task UpdateBookingStatusAsync(int bookingId, string status)
    {
        await _bookingClient.UpdateBookingStatus(bookingId, status);
    }

    public async Task<List<UserSummary>> GetUsersAsync()
    {
        return await _identityClient.GetUsersAsync();
    }

    public async Task BlockUserAsync(int id, bool isBlocked)
    {
        await _identityClient.BlockUserAsync(id, isBlocked);
    }

    public async Task DeleteUserAsync(int id)
    {
        await _identityClient.DeleteUserAsync(id);
    }

    public async Task<List<HotelSummary>> GetHotelsAsync()
    {
        return await _catalogClient.GetHotelsAsync();
    }

    public async Task<List<RoomSummary>> GetRoomsByHotelAsync(Guid hotelId)
    {
        return await _catalogClient.GetRoomsByHotelAsync(hotelId);
    }

    public async Task AddHotelAsync(object payload)
    {
        await _catalogClient.AddHotelAsync(payload);
    }

    public async Task UpdateHotelAsync(Guid id, object payload)
    {
        await _catalogClient.UpdateHotelAsync(id, payload);
    }

    public async Task DeleteHotelAsync(Guid id)
    {
        await _catalogClient.DeleteHotelAsync(id);
    }

    public async Task AddRoomAsync(object payload)
    {
        await _catalogClient.AddRoomAsync(payload);
    }

    public async Task UpdateRoomAsync(Guid id, object payload)
    {
        await _catalogClient.UpdateRoomAsync(id, payload);
    }

    public async Task DeleteRoomAsync(Guid id)
    {
        await _catalogClient.DeleteRoomAsync(id);
    }

    public async Task<DashboardStats> GetDashboardStatsAsync()
    {
        var bookings = await _bookingClient.GetAllBookings();
        var users = await _identityClient.GetUsersAsync();

        return new DashboardStats
        {
            TotalBookings = bookings.Count,
            ActiveUsers = users.Count(u => !u.IsBlocked),
            Revenue = bookings.Sum(b => b.TotalAmount)
        };
    }
}