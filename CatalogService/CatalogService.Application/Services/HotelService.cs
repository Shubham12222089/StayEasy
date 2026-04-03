using CatalogService.Application.DTOs.Request;
using CatalogService.Application.DTOs.Response;
using CatalogService.Application.Interfaces;
using CatalogService.Domain.Entities;
using CatalogService.Infrastructure.Repositories;

namespace CatalogService.Application.Services;

public class HotelService : IHotelService
{
    private readonly HotelRepository _repository;

    public HotelService(HotelRepository repository)
    {
        _repository = repository;
    }

    public async Task AddHotelAsync(CreateHotelRequest request)
    {
        var hotel = new Hotel
        {
            Name = request.Name,
            Location = request.Location,
            Description = request.Description,
            PricePerNight = request.PricePerNight,
            AvailableRooms = request.AvailableRooms
        };

        await _repository.AddAsync(hotel);
    }

    public async Task<List<HotelResponse>> GetAllHotelsAsync()
    {
        var hotels = await _repository.GetAllAsync();

        return hotels.Select(h => new HotelResponse
        {
            Id = h.Id,
            Name = h.Name,
            Location = h.Location,
            PricePerNight = h.PricePerNight
        }).ToList();
    }

    public async Task<HotelResponse?> GetHotelByIdAsync(int id)
    {
        var hotel = await _repository.GetByIdAsync(id);

        if (hotel == null) return null;

        return new HotelResponse
        {
            Id = hotel.Id,
            Name = hotel.Name,
            Location = hotel.Location,
            PricePerNight = hotel.PricePerNight
        };
    }
}