using BookingService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookingService.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Booking> Bookings => Set<Booking>();
}