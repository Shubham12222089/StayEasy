using CatalogService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Hotel> Hotels => Set<Hotel>();
    public DbSet<Room> Rooms => Set<Room>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure decimal precision to avoid silent truncation warnings
        modelBuilder.Entity<Hotel>().Property(h => h.PricePerNight).HasPrecision(18, 2);
        modelBuilder.Entity<Hotel>().Property(h => h.Rating).HasPrecision(3, 2);

        modelBuilder.Entity<Room>().Property(r => r.Price).HasPrecision(18, 2);

        base.OnModelCreating(modelBuilder);
    }
}