using BookingService.Infrastructure.Security;
using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace BookingService.Infrastructure.Messaging;

public class LogoutEventConsumer : BackgroundService
{
    private readonly RevokedTokenStore _store;
    private IConnection? _connection;
    private IChannel? _channel;

    public LogoutEventConsumer(RevokedTokenStore store)
    {
        _store = store;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory
        {
            HostName = "localhost"
        };

        _connection = await factory.CreateConnectionAsync(stoppingToken);
        _channel = await _connection.CreateChannelAsync();

        await _channel.QueueDeclareAsync("logout_event",
            durable: false,
            exclusive: false,
            autoDelete: false);

        var consumer = new AsyncEventingBasicConsumer(_channel);

        consumer.ReceivedAsync += async (_, ea) =>
        {
            var message = Encoding.UTF8.GetString(ea.Body.ToArray());
            var logoutEvent = JsonSerializer.Deserialize<LogoutEvent>(message);

            if (logoutEvent != null && !string.IsNullOrWhiteSpace(logoutEvent.Jti))
            {
                _store.Add(logoutEvent.Jti, logoutEvent.ExpiresAt);
            }

            await Task.CompletedTask;
        };

        await _channel.BasicConsumeAsync(
            queue: "logout_event",
            autoAck: true,
            consumer: consumer);

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(TimeSpan.FromSeconds(1), stoppingToken);
        }
    }

    public override async Task StopAsync(CancellationToken stoppingToken)
    {
        if (_channel != null)
        {
            await _channel.CloseAsync(stoppingToken);
            _channel.Dispose();
        }

        if (_connection != null)
        {
            await _connection.CloseAsync(stoppingToken);
            _connection.Dispose();
        }

        await base.StopAsync(stoppingToken);
    }
}
