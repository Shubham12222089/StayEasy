using System.Net.Http.Json;

namespace BookingService.Infrastructure.Services;

public class CatalogServiceClient
{
    private readonly HttpClient _httpClient;

    public CatalogServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<decimal> GetHotelPrice(int hotelId)
    {
        var response = await _httpClient.GetFromJsonAsync<HotelResponse>(
            $"https://localhost:7092/api/hotels/{hotelId}"
        );

        return response?.PricePerNight ?? 0;
    }
}

public class HotelResponse
{
    public int Id { get; set; }
    public decimal PricePerNight { get; set; }
}
