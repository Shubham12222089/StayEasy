using BookingService.Application.DTOs.Request;
using BookingService.Application.Events;
using BookingService.Application.Services;
using BookingService.Domain.Entities;
using BookingService.Infrastructure.Data;
using BookingService.Infrastructure.Interfaces;
using BookingService.Infrastructure.Repositories;
using BookingService.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace BookingService.Tests;

public class BookingServiceTests
{
    [Fact]
    public async Task AddToCartAsync_PublishesPendingOnce_WhenCartWasEmpty()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new AppDbContext(options);
        var repository = new BookingRepository(context);

        var catalogClient = new Mock<ICatalogServiceClient>();
        catalogClient.Setup(c => c.GetRoomAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new RoomResponse { Id = Guid.NewGuid(), Price = 200, AvailableCount = 10 });

        var publisher = new Mock<IRabbitMQPublisher>();
        publisher.Setup(p => p.PublishAsync("cart_pending", It.IsAny<CartPendingEvent>()))
            .Returns(Task.CompletedTask);

        var service = new BookingService.Application.Services.BookingService(repository, catalogClient.Object, publisher.Object);
        var request = new AddToCartRequest { RoomId = Guid.NewGuid(), Quantity = 1 };

        await service.AddToCartAsync(1, request);
        await service.AddToCartAsync(1, request);

        publisher.Verify(p => p.PublishAsync("cart_pending", It.IsAny<CartPendingEvent>()), Times.Once);
        var cart = await repository.GetOrCreateCart(1);
        Assert.Single(cart.Items);
        Assert.Equal(2, cart.Items[0].Quantity);
    }

    [Fact]
    public async Task CheckoutAsync_CreatesBooking_PublishesEvents_AndClearsCart()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new AppDbContext(options);
        var repository = new BookingRepository(context);

        var cart = await repository.GetOrCreateCart(1);
        cart.Items.Add(new CartItem { RoomId = Guid.NewGuid(), Quantity = 1, Price = 100 });
        await repository.SaveChangesAsync();

        var catalogClient = new Mock<ICatalogServiceClient>();
        catalogClient.Setup(c => c.ReserveRoomAsync(It.IsAny<Guid>(), It.IsAny<int>()))
            .Returns(Task.CompletedTask);

        var publisher = new Mock<IRabbitMQPublisher>();
        publisher.Setup(p => p.PublishAsync("cart_checked_out", It.IsAny<CartCheckedOutEvent>()))
            .Returns(Task.CompletedTask);
        publisher.Setup(p => p.PublishAsync("booking_created", It.IsAny<object>()))
            .Returns(Task.CompletedTask);
        publisher.Setup(p => p.PublishAsync("booking_status_updated", It.IsAny<BookingStatusUpdatedEvent>()))
            .Returns(Task.CompletedTask);

        var service = new BookingService.Application.Services.BookingService(repository, catalogClient.Object, publisher.Object);

        await service.CheckoutAsync(1);

        var updatedCart = await repository.GetOrCreateCart(1);
        Assert.Empty(updatedCart.Items);
        Assert.Single(context.Bookings);

        publisher.Verify(p => p.PublishAsync("cart_checked_out", It.IsAny<CartCheckedOutEvent>()), Times.Once);
        publisher.Verify(p => p.PublishAsync("booking_created", It.IsAny<object>()), Times.Once);
        publisher.Verify(p => p.PublishAsync("booking_status_updated", It.IsAny<BookingStatusUpdatedEvent>()), Times.Once);
    }
}
