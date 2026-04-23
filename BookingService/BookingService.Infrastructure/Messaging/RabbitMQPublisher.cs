using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

using BookingService.Infrastructure.Interfaces;

namespace BookingService.Infrastructure.Messaging;

public class RabbitMQPublisher : IRabbitMQPublisher
{
    private readonly ConnectionFactory _factory;

    public RabbitMQPublisher(IConfiguration configuration)
    {
        _factory = new ConnectionFactory()
        {
            HostName = configuration["RabbitMQ:Host"] ?? "localhost"
        };
    }

    public async Task PublishAsync<T>(string queueName, T message)
    {
        using var connection = await _factory.CreateConnectionAsync();
        using var channel = await connection.CreateChannelAsync();

        await channel.QueueDeclareAsync(queueName,
            durable: true,
            exclusive: false,
            autoDelete: false);

        var json = JsonSerializer.Serialize(message);
        var body = Encoding.UTF8.GetBytes(json);

        var properties = new BasicProperties
        {
            Persistent = true
        };

        await channel.BasicPublishAsync(
            exchange: "",
            routingKey: queueName,
            mandatory: false,
            basicProperties: properties,
            body: body);
    }
}
