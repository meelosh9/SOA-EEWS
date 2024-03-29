using Notification;
using AnalyticsService;


namespace AnalyticsService
{
    public class Program
    {
        public static async Task Main(string[] args)
        {

            var httpClient = new HttpClient();
            
            httpClient.BaseAddress = new Uri("http://ekuiper:9081");

            await eKuiperService.ConfigureStreamApiInput(httpClient);
            await eKuiperService.ConfigureStreamSensorInput(httpClient);
            await eKuiperService.ConfigureQueryApiInput(httpClient);
            await eKuiperService.ConfigureQuerySensorInput(httpClient);


            await Host.CreateDefaultBuilder(args).ConfigureServices(async services =>
            {
                await MQTTService.SubscribeToTopic("detected_earthquakes", MQTTService.MessageRecieved);

            }).Build().RunAsync();


        }
    }
}