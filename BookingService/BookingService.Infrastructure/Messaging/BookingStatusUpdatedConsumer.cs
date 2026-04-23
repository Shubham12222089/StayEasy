using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.Exceptions;
using System.Text;

namespace BookingService.Infrastructure.Messaging;

public class BookingStatusUpdatedConsumer : BackgroundService
{
    private IConnection? _connection;
    private IChannel? _channel;
    private readonly string _host;

    public BookingStatusUpdatedConsumer(IConfiguration configuration)
    {
        _host = configuration["RabbitMQ:Host"] ?? "localhost";
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory
        {
            HostName = _host
        };

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _connection = await factory.CreateConnectionAsync(stoppingToken);
                _channel = await _connection.CreateChannelAsync();

                await _channel.QueueDeclareAsync("booking_status_updated",
                    durable: true,
                    exclusive: false,
                    autoDelete: false);

                var consumer = new AsyncEventingBasicConsumer(_channel);

                consumer.ReceivedAsync += async (_, ea) =>
                {
                    _ = Encoding.UTF8.GetString(ea.Body.ToArray());
                    await Task.CompletedTask;
                };

                await _channel.BasicConsumeAsync(
                    queue: "booking_status_updated",
                    autoAck: true,
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
}
