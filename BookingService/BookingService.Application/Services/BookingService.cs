using BookingService.Application.DTOs.Request;
using BookingService.Application.Events;
using BookingService.Application.Exceptions;
using BookingService.Application.Interfaces;
using BookingService.Infrastructure.Interfaces;
using BookingService.Domain.Entities;
using BookingService.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;

namespace BookingService.Application.Services;

public class BookingService : IBookingService
{
    private readonly BookingRepository _repository;
    private readonly ICatalogServiceClient _catalogClient;
    private readonly IRabbitMQPublisher _publisher;

    public BookingService(BookingRepository repository, ICatalogServiceClient catalogClient, IRabbitMQPublisher publisher)
    {
        _repository = repository;
        _catalogClient = catalogClient;
        _publisher = publisher;
    }

    public async Task AddToCartAsync(int userId, AddToCartRequest request)
    {
        var cart = await _repository.GetOrCreateCart(userId);
        var wasEmpty = cart.Items.Count == 0;

        var room = await _catalogClient.GetRoomAsync(request.RoomId);

        if (room == null)
            throw new ApiException("Room not found", StatusCodes.Status404NotFound);

        if (room.AvailableCount < request.Quantity)
            throw new ApiException("Room not available", StatusCodes.Status400BadRequest);

        var existingItem = cart.Items.FirstOrDefault(i => i.RoomId == request.RoomId);

        if (existingItem == null)
        {
            cart.Items.Add(new CartItem
            {
                RoomId = request.RoomId,
                Quantity = request.Quantity,
                Price = room.Price
            });
        }
        else
        {
            existingItem.Quantity += request.Quantity;
            existingItem.Price = room.Price;
        }

        await _repository.SaveChangesAsync();

        if (wasEmpty)
        {
            await _publisher.PublishAsync("cart_pending", new CartPendingEvent
            {
                UserId = userId,
                RoomId = request.RoomId,
                Quantity = request.Quantity,
                Price = room.Price
            });
        }
    }

    public async Task CheckoutAsync(int userId)
    {
        var cart = await _repository.GetOrCreateCart(userId);

        if (cart.Items.Count == 0)
            throw new ApiException("Cart is empty", StatusCodes.Status400BadRequest);

        var total = cart.Items.Sum(i => i.Price * i.Quantity);
        var itemCount = cart.Items.Sum(i => i.Quantity);

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

        await _publisher.PublishAsync("cart_checked_out", new CartCheckedOutEvent
        {
            UserId = userId,
            ItemCount = itemCount,
            TotalAmount = total
        });

        await _publisher.PublishAsync("booking_created", new
        {
            BookingId = booking.Id,
            UserId = userId,
            TotalAmount = total
        });

        await _publisher.PublishAsync("booking_status_updated", new BookingStatusUpdatedEvent
        {
            BookingId = booking.Id,
            UserId = booking.UserId,
            Status = booking.Status
        });

        cart.Items.Clear();
        await _repository.SaveChangesAsync();
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
