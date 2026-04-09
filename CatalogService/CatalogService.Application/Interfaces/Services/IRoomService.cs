using CatalogService.Application.DTOs.Request;
using CatalogService.Application.DTOs.Response;

namespace CatalogService.Application.Interfaces;

public interface IRoomService
{
    Task AddRoomAsync(CreateRoomRequest request);

    Task<List<RoomResponse>> GetRoomsByHotelAsync(Guid hotelId);

    Task<RoomResponse?> GetRoomByIdAsync(Guid id);

    Task ReserveRoomAsync(Guid roomId, int quantity);

    Task UpdateRoomAsync(Guid id, UpdateRoomRequest request);

    Task DeleteRoomAsync(Guid id);
}
