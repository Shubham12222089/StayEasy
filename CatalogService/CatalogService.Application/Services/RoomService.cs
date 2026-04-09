using CatalogService.Application.DTOs.Request;
using CatalogService.Application.DTOs.Response;
using CatalogService.Application.Exceptions;
using CatalogService.Application.Interfaces;
using CatalogService.Domain.Entities;
using CatalogService.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;

namespace CatalogService.Application.Services;

public class RoomService : IRoomService
{
    private readonly RoomRepository _repository;

    public RoomService(RoomRepository repository)
    {
        _repository = repository;
    }

    public async Task AddRoomAsync(CreateRoomRequest request)
    {
        var room = new Room
        {
            HotelId = request.HotelId,
            Type = request.Type,
            Price = request.Price,
            AvailableCount = request.AvailableCount
        };

        await _repository.AddAsync(room);
    }

    public async Task<List<RoomResponse>> GetRoomsByHotelAsync(Guid hotelId)
    {
        var rooms = await _repository.GetByHotelIdAsync(hotelId);

        return rooms.Select(r => new RoomResponse
        {
            Id = r.Id,
            HotelId = r.HotelId,
            Type = r.Type,
            Price = r.Price,
            AvailableCount = r.AvailableCount
        }).ToList();
    }

    public async Task<RoomResponse?> GetRoomByIdAsync(Guid id)
    {
        var room = await _repository.GetByIdAsync(id);

        if (room == null) return null;

        return new RoomResponse
        {
            Id = room.Id,
            HotelId = room.HotelId,
            Type = room.Type,
            Price = room.Price,
            AvailableCount = room.AvailableCount
        };
    }

    public async Task ReserveRoomAsync(Guid roomId, int quantity)
    {
        var room = await _repository.GetByIdAsync(roomId);

        if (room == null)
            throw new ApiException("Room not found", StatusCodes.Status404NotFound);

        if (room.AvailableCount < quantity)
            throw new ApiException("Room not available", StatusCodes.Status400BadRequest);

        room.AvailableCount -= quantity;

        await _repository.SaveChangesAsync();
    }

    public async Task UpdateRoomAsync(Guid id, UpdateRoomRequest request)
    {
        var room = await _repository.GetByIdAsync(id);

        if (room == null)
            throw new ApiException("Room not found", StatusCodes.Status404NotFound);

        room.Type = request.Type;
        room.Price = request.Price;
        room.AvailableCount = request.AvailableCount;

        await _repository.SaveChangesAsync();
    }

    public async Task DeleteRoomAsync(Guid id)
    {
        var room = await _repository.GetByIdAsync(id);

        if (room == null)
            throw new ApiException("Room not found", StatusCodes.Status404NotFound);

        await _repository.DeleteAsync(room);
    }
}
