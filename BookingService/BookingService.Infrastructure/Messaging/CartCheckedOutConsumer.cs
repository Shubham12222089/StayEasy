using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.Exceptions;
using System.Text;
using System.Text.Json;

namespace BookingService.Infrastructure.Messaging;

public class CartCheckedOutConsumer : BackgroundService
{
    private IConnection? _connection;
    private IChannel? _channel;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory
        {
            HostName = "localhost"
        };

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _connection = await factory.CreateConnectionAsync(stoppingToken);
                _channel = await _connection.CreateChannelAsync();

                await _channel.QueueDeclareAsync("cart_checked_out",
                    durable: true,
                    exclusive: false,
                    autoDelete: false);

                await _channel.QueueDeclareAsync("cart_pending",
                    durable: true,
                    exclusive: false,
                    autoDelete: false);

                var consumer = new AsyncEventingBasicConsumer(_channel);

                consumer.ReceivedAsync += async (_, ea) =>
                {
                    var message = Encoding.UTF8.GetString(ea.Body.ToArray());
                    var userId = TryGetUserId(message);

                    if (userId.HasValue)
                    {
                        await RemovePendingForUserAsync(userId.Value, stoppingToken);
                    }

                    await _channel.BasicAckAsync(ea.DeliveryTag, multiple: false);
                };

                await _channel.BasicConsumeAsync(
                    queue: "cart_checked_out",
                    autoAck: false,
                    consumer: consumer);

                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (BrokerUnreachableException)
            {
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
            catch (Exception)
            {
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
            finally
            {
                if (_channel != null)
                {
                    await _channel.CloseAsync(stoppingToken);
                    _channel.Dispose();
                    _channel = null;
                }

                if (_connection != null)
                {
                    await _connection.CloseAsync(stoppingToken);
                    _connection.Dispose();
                    _connection = null;
                }
            }
        }
    }

    private async Task RemovePendingForUserAsync(int userId, CancellationToken stoppingToken)
    {
        if (_channel == null)
        {
            return;
        }

        var queueState = await _channel.QueueDeclareAsync("cart_pending",
            durable: true,
            exclusive: false,
            autoDelete: false);

        var toCheck = (int)queueState.MessageCount;

        for (var i = 0; i < toCheck && !stoppingToken.IsCancellationRequested; i++)
        {
            var result = await _channel.BasicGetAsync("cart_pending", autoAck: false);

            if (result == null)
            {
                break;
            }

            var body = result.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            var pendingUserId = TryGetUserId(message);

            await _channel.BasicAckAsync(result.DeliveryTag, multiple: false);

            if (!pendingUserId.HasValue || pendingUserId.Value != userId)
            {
                var properties = new BasicProperties
                {
                    Persistent = true
                };

                await _channel.BasicPublishAsync(
                    exchange: "",
                    routingKey: "cart_pending",
                    mandatory: false,
                    basicProperties: properties,
                    body: body);
            }
        }
    }

    private static int? TryGetUserId(string json)
    {
        try
        {
            using var document = JsonDocument.Parse(json);

            if (document.RootElement.TryGetProperty("UserId", out var userIdProperty) && userIdProperty.TryGetInt32(out var userId))
            {
                return userId;
            }
        }
        catch (JsonException)
        {
        }

        return null;
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
