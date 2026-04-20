using CatalogService.Infrastructure.Security;
using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.Exceptions;
using RabbitMQ.Client.Exceptions;
using System.Text;
using System.Text.Json;

namespace CatalogService.Infrastructure.Messaging;

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

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _connection = await factory.CreateConnectionAsync(stoppingToken);
                _channel = await _connection.CreateChannelAsync();

                await _channel.QueueDeclareAsync("logout_event",
                    durable: true,
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
