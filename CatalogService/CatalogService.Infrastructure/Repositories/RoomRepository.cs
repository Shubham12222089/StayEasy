using CatalogService.Domain.Entities;
using CatalogService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Infrastructure.Repositories;

public class RoomRepository
{
    private readonly AppDbContext _context;

    public RoomRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Room room)
    {
        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Room>> GetByHotelIdAsync(int hotelId)
    {
        return await _context.Rooms
            .Where(r => r.HotelId == hotelId)
            .ToListAsync();
    }

    public async Task<Room?> GetByIdAsync(int id)
    {
        return await _context.Rooms.FindAsync(id);
    }

    public async Task DeleteAsync(Room room)
    {
        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
