using BookingService.Infrastructure.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;

namespace BookingService.Infrastructure.Services;

public class CatalogServiceClient : ICatalogServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;

    public CatalogServiceClient(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _baseUrl = configuration["ServiceUrls:Catalog"] ?? "https://localhost:7092";
    }

    public async Task<RoomResponse?> GetRoomAsync(Guid roomId)
    {
        return await _httpClient.GetFromJsonAsync<RoomResponse>(
            $"{_baseUrl}/api/rooms/{roomId}"
        );
    }

    public async Task ReserveRoomAsync(Guid roomId, int quantity)
    {
        var response = await _httpClient.PutAsJsonAsync(
            $"{_baseUrl}/api/rooms/{roomId}/reserve",
            new ReserveRoomRequest { Quantity = quantity });

        response.EnsureSuccessStatusCode();
    }
}

public class ReserveRoomRequest
{
    public int Quantity { get; set; }
}

public class RoomResponse
{
    public Guid Id { get; set; }
    public decimal Price { get; set; }
    public int AvailableCount { get; set; }
}
