using CatalogService.Application.DTOs.Request;
using CatalogService.Application.Exceptions;
using CatalogService.Application.Services;
using CatalogService.Infrastructure.Data;
using CatalogService.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Tests;

public class HotelServiceTests
{
    [Fact]
    public async Task AddHotelAsync_CreatesHotel()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new AppDbContext(options);
        var repository = new HotelRepository(context);
        var service = new HotelService(repository);

        var request = new CreateHotelRequest
        {
            Name = "Test Hotel",
            Location = "Test City",
            Description = "Test",
            PricePerNight = 100,
            AvailableRooms = 5
        };

        await service.AddHotelAsync(request);

        Assert.Single(context.Hotels);
        var hotel = await context.Hotels.FirstAsync();
        Assert.Equal("Test Hotel", hotel.Name);
        Assert.Equal("Test City", hotel.Location);
    }

    [Fact]
    public async Task UpdateHotelAsync_Throws_WhenNotFound()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new AppDbContext(options);
        var repository = new HotelRepository(context);
        var service = new HotelService(repository);

        var request = new UpdateHotelRequest
        {
            Name = "Updated",
            Location = "Updated",
            Description = "Updated",
            PricePerNight = 120,
            AvailableRooms = 2
        };

        var exception = await Assert.ThrowsAsync<ApiException>(() => service.UpdateHotelAsync(Guid.NewGuid(), request));
        Assert.Equal(StatusCodes.Status404NotFound, exception.StatusCode);
    }
}
