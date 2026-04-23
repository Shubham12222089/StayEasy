using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using AdminService.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace AdminService.Infrastructure.Services;

public class BookingClient
{
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly string _baseUrl;

    public BookingClient(HttpClient httpClient, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _httpContextAccessor = httpContextAccessor;
        _baseUrl = configuration["ServiceUrls:Booking"] ?? "https://localhost:7071";
    }

    public async Task<List<BookingSummary>> GetAllBookings()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"{_baseUrl}/api/booking/all");

        var token = _httpContextAccessor.HttpContext?
            .Request.Headers["Authorization"]
            .ToString();

        if (!string.IsNullOrEmpty(token))
        {
            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", token.Replace("Bearer ", ""));
        }

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<List<BookingSummary>>() ?? new List<BookingSummary>();
    }

    public async Task UpdateBookingStatus(int bookingId, string status)
    {
        var request = new HttpRequestMessage(HttpMethod.Put,
            $"{_baseUrl}/api/booking/{bookingId}/status");

        var token = _httpContextAccessor.HttpContext?
            .Request.Headers["Authorization"]
            .ToString();

        if (!string.IsNullOrEmpty(token))
        {
            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", token.Replace("Bearer ", ""));
        }

        request.Content = JsonContent.Create(new
        {
            status = status
        });

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }
}