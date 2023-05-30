using Google.Protobuf;
using Grpc.Core;
using Grpc.Net.Client;
using System.Threading.Tasks;
using AnalyticsService;
namespace Notification
{
    public static class Grpc
    {
        public static void SendNotification(EarthquakeDTO message)
        {
            try
            {
                GrpcChannelOptions options = new GrpcChannelOptions();
                var httpHandler = new HttpClientHandler();
                httpHandler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
                options.Credentials = ChannelCredentials.Insecure;
                options.HttpHandler = httpHandler;
                using var channel = GrpcChannel.ForAddress("http://notification_service:50052", options);
                var client = new Notification.NotificationClient(channel);

                NotificationRequest notification = new NotificationRequest()
                {
                    Date = message.Date.ToString(),
                    Time = message.Time.ToString(),
                    Latitude = message.Latitude,
                    Longitude = message.Longitude,
                    Type = message.Type,
                    Depth = message.Depth,
                    Magnitude = message.Magnitude,
                    MagnitudeType = message.MagnitudeType,
                    ID = message.ID,
                };
                var reply = client.SendNotification(notification);
                Console.WriteLine("Notification sent");
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }

}