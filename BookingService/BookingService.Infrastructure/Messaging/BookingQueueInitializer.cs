using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using RabbitMQ.Client.Exceptions;

namespace BookingService.Infrastructure.Messaging;

public class BookingQueueInitializer : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory
        {
            HostName = "localhost"
        };

        var queues = new[]
        {
            "cart_pending",
            "cart_checked_out",
            "booking_created",
            "booking_status_updated",
            "logout_event"
        };

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var connection = await factory.CreateConnectionAsync(stoppingToken);

                foreach (var queue in queues)
                {
                    await DeclareQueueAsync(connection, queue, stoppingToken);
                }

                break;
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
        }
    }

    private static async Task DeclareQueueAsync(IConnection connection, string queue, CancellationToken stoppingToken)
    {
        await using var channel = await connection.CreateChannelAsync();

        try
        {
            await channel.QueueDeclareAsync(queue,
                durable: true,
                exclusive: false,
                autoDelete: false);
        }
        catch (OperationInterruptedException ex) when (ex.ShutdownReason?.ReplyCode == 406)
        {
            await using var recreateChannel = await connection.CreateChannelAsync();
            await recreateChannel.QueueDeleteAsync(queue, ifUnused: false, ifEmpty: false, cancellationToken: stoppingToken);
            await recreateChannel.QueueDeclareAsync(queue,
                durable: true,
                exclusive: false,
                autoDelete: false);
        }
    }
}
