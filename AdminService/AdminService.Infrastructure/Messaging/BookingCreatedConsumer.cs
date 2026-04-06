using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace AdminService.Infrastructure.Messaging;

public class BookingCreatedConsumer
{
    public async Task StartAsync()
    {
        var factory = new ConnectionFactory()
        {
            HostName = "localhost"
        };

        var connection = await factory.CreateConnectionAsync();
        var channel = await connection.CreateChannelAsync();

        await channel.QueueDeclareAsync("booking_created",
            durable: false,
            exclusive: false,
            autoDelete: false);

        var consumer = new AsyncEventingBasicConsumer(channel);

        consumer.ReceivedAsync += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);

            Console.WriteLine($"🔥 Booking Created Event Received: {message}");
            await Task.CompletedTask;
        };

        await channel.BasicConsumeAsync(
            queue: "booking_created",
            autoAck: true,
            consumer: consumer);
    }
}
