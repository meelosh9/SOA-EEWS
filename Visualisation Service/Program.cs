namespace Visualisation_Service
{
    public class Program
    {
        public static async Task Main(string[] args)
        {

            await Host.CreateDefaultBuilder(args).ConfigureServices(async services =>
            {
                await MQTTService.SubscribeToTopic("EdgeXEvents", MQTTService.MessageRecieved);

            }).Build().RunAsync();


        }
    }
}