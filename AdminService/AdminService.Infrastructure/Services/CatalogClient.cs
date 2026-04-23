using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using AdminService.Domain.DTOs.Request;
using AdminService.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace AdminService.Infrastructure.Services;

public class CatalogClient
{
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly string _baseUrl;

    public CatalogClient(HttpClient httpClient, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _httpContextAccessor = httpContextAccessor;
        _baseUrl = configuration["ServiceUrls:Catalog"] ?? "https://localhost:7092";
    }

    public async Task<List<HotelSummary>> GetHotelsAsync()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"{_baseUrl}/api/hotels");
        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<List<HotelSummary>>() ?? new List<HotelSummary>();
    }

    public async Task<List<RoomSummary>> GetRoomsByHotelAsync(Guid hotelId)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"{_baseUrl}/api/rooms/hotel/{hotelId}");
        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<List<RoomSummary>>() ?? new List<RoomSummary>();
    }

    public async Task AddHotelAsync(CreateHotelRequest payload)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/api/hotels")
        {
            Content = JsonContent.Create(payload)
        };

        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task UpdateHotelAsync(Guid id, UpdateHotelRequest payload)
    {
        var request = new HttpRequestMessage(HttpMethod.Put, $"{_baseUrl}/api/hotels/{id}")
        {
            Content = JsonContent.Create(payload)
        };

        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task DeleteHotelAsync(Guid id)
    {
        var request = new HttpRequestMessage(HttpMethod.Delete, $"{_baseUrl}/api/hotels/{id}");
        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task AddRoomAsync(CreateRoomRequest payload)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/api/rooms")
        {
            Content = JsonContent.Create(payload)
        };

        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task UpdateRoomAsync(Guid id, UpdateRoomRequest payload)
    {
        var request = new HttpRequestMessage(HttpMethod.Put, $"{_baseUrl}/api/rooms/{id}")
        {
            Content = JsonContent.Create(payload)
        };

        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task DeleteRoomAsync(Guid id)
    {
        var request = new HttpRequestMessage(HttpMethod.Delete, $"{_baseUrl}/api/rooms/{id}");
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
