using System.Net.Http.Headers;
using System.Net.Http.Json;
using AdminService.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace AdminService.Infrastructure.Services;

public class IdentityClient
{
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public IdentityClient(HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
    {
        _httpClient = httpClient;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<UserSummary>> GetUsersAsync()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "https://localhost:7006/api/admin/users");
        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<List<UserSummary>>() ?? new List<UserSummary>();
    }

    public async Task BlockUserAsync(int id, bool isBlocked)
    {
        var request = new HttpRequestMessage(HttpMethod.Put, $"https://localhost:7006/api/admin/users/{id}/block")
        {
            Content = JsonContent.Create(new { isBlocked })
        };

        AddAuthHeader(request);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task DeleteUserAsync(int id)
    {
        var request = new HttpRequestMessage(HttpMethod.Delete, $"https://localhost:7006/api/admin/users/{id}");
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
