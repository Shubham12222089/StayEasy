using CatalogService.Application.DTOs.Request;
using CatalogService.Application.DTOs.Response;
using CatalogService.Application.Exceptions;
using CatalogService.Application.Interfaces;
using CatalogService.Domain.Entities;
using CatalogService.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;

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

    public async Task UpdateHotelAsync(int id, UpdateHotelRequest request)
    {
        var hotel = await _repository.GetByIdAsync(id);

        if (hotel == null)
            throw new ApiException("Hotel not found", StatusCodes.Status404NotFound);

        hotel.Name = request.Name;
        hotel.Location = request.Location;
        hotel.Description = request.Description;
        hotel.PricePerNight = request.PricePerNight;
        hotel.AvailableRooms = request.AvailableRooms;

        await _repository.SaveChangesAsync();
    }

    public async Task DeleteHotelAsync(int id)
    {
        var hotel = await _repository.GetByIdAsync(id);

        if (hotel == null)
            throw new ApiException("Hotel not found", StatusCodes.Status404NotFound);

        await _repository.DeleteAsync(hotel);
    }
}