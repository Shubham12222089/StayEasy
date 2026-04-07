using System.Net.Http.Json;

namespace BookingService.Infrastructure.Services;

public class CatalogServiceClient
{
    private readonly HttpClient _httpClient;

    public CatalogServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<RoomResponse?> GetRoomAsync(int roomId)
    {
        return await _httpClient.GetFromJsonAsync<RoomResponse>(
            $"https://localhost:7092/api/rooms/{roomId}"
        );
    }

    public async Task ReserveRoomAsync(int roomId, int quantity)
    {
        var response = await _httpClient.PutAsJsonAsync(
            $"https://localhost:7092/api/rooms/{roomId}/reserve",
            new ReserveRoomRequest { Quantity = quantity });

        response.EnsureSuccessStatusCode();
    }
}

public class RoomResponse
{
    public int Id { get; set; }
    public decimal Price { get; set; }
    public int AvailableCount { get; set; }
}

public class ReserveRoomRequest
{
    public int Quantity { get; set; }
}
