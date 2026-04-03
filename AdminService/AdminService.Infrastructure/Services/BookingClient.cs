using System.Net.Http.Headers;
using System.Net.Http.Json;
using AdminService.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace AdminService.Infrastructure.Services;

public class BookingClient
{
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public BookingClient(HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
    {
        _httpClient = httpClient;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<BookingSummary>> GetAllBookings()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "https://localhost:7071/api/booking/all");

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
}