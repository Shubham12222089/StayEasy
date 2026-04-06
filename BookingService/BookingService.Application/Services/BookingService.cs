using BookingService.Application.DTOs.Request;
using BookingService.Application.Interfaces;
using BookingService.Domain.Entities;
using BookingService.Infrastructure.Messaging;
using BookingService.Infrastructure.Repositories;
using BookingService.Infrastructure.Services;

namespace BookingService.Application.Services;

public class BookingService : IBookingService
{
    private readonly BookingRepository _repository;
    private readonly CatalogServiceClient _catalogClient;
    private readonly RabbitMQPublisher _publisher;

    public BookingService(BookingRepository repository, CatalogServiceClient catalogClient, RabbitMQPublisher publisher)
    {
        _repository = repository;
        _catalogClient = catalogClient;
        _publisher = publisher;
    }

    public async Task AddToCartAsync(int userId, AddToCartRequest request)
    {
        var cart = await _repository.GetOrCreateCart(userId);

        var price = await _catalogClient.GetHotelPrice(request.HotelId);

        cart.Items.Add(new CartItem
        {
            HotelId = request.HotelId,
            Quantity = request.Quantity,
            Price = price
        });

        await _repository.SaveChangesAsync();
    }

    public async Task CheckoutAsync(int userId)
    {
        var cart = await _repository.GetOrCreateCart(userId);

        var total = cart.Items.Sum(i => i.Price * i.Quantity);

        var booking = new Booking
        {
            UserId = userId,
            TotalAmount = total,
            Status = "Confirmed"
        };

        await _repository.AddBookingAsync(booking);

        await _publisher.PublishAsync("booking_created", new
        {
            BookingId = booking.Id,
            UserId = userId,
            TotalAmount = total
        });
    }

    public async Task<List<Booking>> GetUserBookingsAsync(int userId)
    {
        return await _repository.GetBookingsByUserId(userId);
    }

    public async Task<List<Booking>> GetAllBookingsAsync()
    {
        return await _repository.GetAllBookingsAsync();
    }

    public async Task UpdateBookingStatusAsync(int bookingId, string status)
    {
        var booking = await _repository.GetBookingById(bookingId);

        if (booking == null)
            throw new Exception("Booking not found");

        booking.Status = status;

        await _repository.SaveChangesAsync();
    }
}
