using CatalogService.Application.DTOs.Request;
using CatalogService.Application.DTOs.Response;

namespace CatalogService.Application.Interfaces;

public interface IHotelService
{
    Task AddHotelAsync(CreateHotelRequest request);

    Task<List<HotelResponse>> GetAllHotelsAsync();

    Task<HotelResponse?> GetHotelByIdAsync(int id);
}