using BookingService.Application.DTOs.Request;
using BookingService.Application.Exceptions;
using BookingService.Application.Interfaces;
using BookingService.Domain.Entities;
using BookingService.Infrastructure.Messaging;
using BookingService.Infrastructure.Repositories;
using BookingService.Infrastructure.Services;
using Microsoft.AspNetCore.Http;

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

        var room = await _catalogClient.GetRoomAsync(request.RoomId);

        if (room == null)
            throw new ApiException("Room not found", StatusCodes.Status404NotFound);

        if (room.AvailableCount < request.Quantity)
            throw new ApiException("Room not available", StatusCodes.Status400BadRequest);

        cart.Items.Add(new CartItem
        {
            RoomId = request.RoomId,
            Quantity = request.Quantity,
            Price = room.Price
        });

        await _repository.SaveChangesAsync();
    }

    public async Task CheckoutAsync(int userId)
    {
        var cart = await _repository.GetOrCreateCart(userId);

        if (cart.Items.Count == 0)
            throw new ApiException("Cart is empty", StatusCodes.Status400BadRequest);

        var total = cart.Items.Sum(i => i.Price * i.Quantity);

        foreach (var item in cart.Items)
        {
            await _catalogClient.ReserveRoomAsync(item.RoomId, item.Quantity);
        }

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
