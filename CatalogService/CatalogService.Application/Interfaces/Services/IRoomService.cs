using CatalogService.Application.DTOs.Request;
using CatalogService.Application.DTOs.Response;

namespace CatalogService.Application.Interfaces;

public interface IRoomService
{
    Task AddRoomAsync(CreateRoomRequest request);

    Task<List<RoomResponse>> GetRoomsByHotelAsync(int hotelId);

    Task<RoomResponse?> GetRoomByIdAsync(int id);

    Task ReserveRoomAsync(int roomId, int quantity);

    Task UpdateRoomAsync(int id, UpdateRoomRequest request);

    Task DeleteRoomAsync(int id);
}
