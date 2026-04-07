using AdminService.Domain.Entities;

namespace AdminService.Application.Interfaces;

public interface IAdminService
{
    Task<List<BookingSummary>> GetAllBookingsAsync();

    Task UpdateBookingStatusAsync(int bookingId, string status);

    Task<List<UserSummary>> GetUsersAsync();

    Task BlockUserAsync(int id, bool isBlocked);

    Task DeleteUserAsync(int id);

    Task<List<HotelSummary>> GetHotelsAsync();

    Task<List<RoomSummary>> GetRoomsByHotelAsync(int hotelId);

    Task AddHotelAsync(object payload);

    Task UpdateHotelAsync(int id, object payload);

    Task DeleteHotelAsync(int id);

    Task AddRoomAsync(object payload);

    Task UpdateRoomAsync(int id, object payload);

    Task DeleteRoomAsync(int id);

    Task<DashboardStats> GetDashboardStatsAsync();
}