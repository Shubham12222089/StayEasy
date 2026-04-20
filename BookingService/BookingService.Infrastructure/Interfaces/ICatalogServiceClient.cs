using BookingService.Infrastructure.Services;

namespace BookingService.Infrastructure.Interfaces;

public interface ICatalogServiceClient
{
    Task<RoomResponse?> GetRoomAsync(Guid roomId);
    Task ReserveRoomAsync(Guid roomId, int quantity);
}
