using CatalogService.Domain.Entities;
using CatalogService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Infrastructure.Repositories;

public class HotelRepository
{
    private readonly AppDbContext _context;

    public HotelRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Hotel hotel)
    {
        _context.Hotels.Add(hotel);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Hotel>> GetAllAsync()
    {
        return await _context.Hotels.ToListAsync();
    }

    public async Task<Hotel?> GetByIdAsync(int id)
    {
        return await _context.Hotels.FindAsync(id);
    }

    public async Task DeleteAsync(Hotel hotel)
    {
        _context.Hotels.Remove(hotel);
        await _context.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}