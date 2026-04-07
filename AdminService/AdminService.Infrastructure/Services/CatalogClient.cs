using System.Net.Http.Headers;
using System.Net.Http.Json;
using AdminService.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace AdminService.Infrastructure.Services;

public class CatalogClient
{
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CatalogClient(HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
    {
        _httpClient = httpClient;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<HotelSummary>> GetHotelsAsync()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "https://localhost:7092/api/hotels");
        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<List<HotelSummary>>() ?? new List<HotelSummary>();
    }

    public async Task<List<RoomSummary>> GetRoomsByHotelAsync(int hotelId)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"https://localhost:7092/api/rooms/hotel/{hotelId}");
        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<List<RoomSummary>>() ?? new List<RoomSummary>();
    }

    public async Task AddHotelAsync(object payload)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "https://localhost:7092/api/hotels")
        {
            Content = JsonContent.Create(payload)
        };

        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task UpdateHotelAsync(int id, object payload)
    {
        var request = new HttpRequestMessage(HttpMethod.Put, $"https://localhost:7092/api/hotels/{id}")
        {
            Content = JsonContent.Create(payload)
        };

        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task DeleteHotelAsync(int id)
    {
        var request = new HttpRequestMessage(HttpMethod.Delete, $"https://localhost:7092/api/hotels/{id}");
        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task AddRoomAsync(object payload)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "https://localhost:7092/api/rooms")
        {
            Content = JsonContent.Create(payload)
        };

        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task UpdateRoomAsync(int id, object payload)
    {
        var request = new HttpRequestMessage(HttpMethod.Put, $"https://localhost:7092/api/rooms/{id}")
        {
            Content = JsonContent.Create(payload)
        };

        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task DeleteRoomAsync(int id)
    {
        var request = new HttpRequestMessage(HttpMethod.Delete, $"https://localhost:7092/api/rooms/{id}");
        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    private void AddAuthHeader(HttpRequestMessage request)
    {
        var token = _httpContextAccessor.HttpContext?
            .Request.Headers["Authorization"]
            .ToString();

        if (!string.IsNullOrEmpty(token))
        {
            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", token.Replace("Bearer ", ""));
        }
    }
}
