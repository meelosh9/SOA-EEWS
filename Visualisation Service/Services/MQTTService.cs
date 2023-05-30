using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Newtonsoft.Json;
using MQTTnet;
using MQTTnet.Client;
using InfluxDB;
namespace Visualisation_Service
{
    public class MQTTService
    {
        public static async Task SubscribeToTopic(string topic, Func<MqttApplicationMessageReceivedEventArgs,Task> e)
        {

            var mqttFactory = new MqttFactory();
            var mqttClient = mqttFactory.CreateMqttClient();

            mqttClient.ApplicationMessageReceivedAsync += e;
            var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("mqtt", 1883).WithClientId("soaeews").Build();

            var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
              .WithTopicFilter(f =>{f.WithTopic(topic);}).Build();

            await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);
            await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);
            Console.WriteLine("Subscribed to topic: " + topic);
        }
        public static async Task MessageRecieved(MqttApplicationMessageReceivedEventArgs e)
        {
            try
            {
                //Console.WriteLine("Received application message.");

                var payloadAsString = System.Text.Encoding.Default.GetString(e.ApplicationMessage.Payload);

                var message = JsonConvert.DeserializeObject<SensorData>(payloadAsString);
                if(message.profileName == "SeismicSensor")
                {
                var Idbs = new InfluxDBService();
                Idbs.Write(message);

                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }                         
            
        }
    }
}
