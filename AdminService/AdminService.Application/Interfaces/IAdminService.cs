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

    Task<List<RoomSummary>> GetRoomsByHotelAsync(Guid hotelId);

    Task AddHotelAsync(object payload);

    Task UpdateHotelAsync(Guid id, object payload);

    Task DeleteHotelAsync(Guid id);

    Task AddRoomAsync(object payload);

    Task UpdateRoomAsync(Guid id, object payload);

    Task DeleteRoomAsync(Guid id);

    Task<DashboardStats> GetDashboardStatsAsync();
}