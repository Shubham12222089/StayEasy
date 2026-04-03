using BookingService.Domain.Entities;
using BookingService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookingService.Infrastructure.Repositories;

public class BookingRepository
{
    private readonly AppDbContext _context;

    public BookingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Cart> GetOrCreateCart(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        return cart;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task AddBookingAsync(Booking booking)
    {
        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Booking>> GetBookingsByUserId(int userId)
    {
        return await _context.Bookings
            .Where(b => b.UserId == userId)
            .ToListAsync();
    }

    public async Task<List<Booking>> GetAllBookingsAsync()
    {
        return await _context.Bookings.ToListAsync();
    }
}