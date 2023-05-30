using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Gateway_service.Models;
using Gateway_service.DTOs;
using MQTTnet;
using MQTTnet.Client;
namespace Gateway_service.Services
{
    public class MQTTService
    {
        public IMqttClient CreateMqttClient()
        {
            var factory = new MqttFactory();
            var client = factory.CreateMqttClient();
            var options = new MqttClientOptionsBuilder().WithTcpServer("mqtt", 1883).WithClientId("soaeews").Build();
            client.ConnectAsync(options);
            return client;


        }
        public async void PublishEarthquake(IMqttClient client, string topic, string data)
        {
            MqttApplicationMessage message = new MqttApplicationMessage();
            client.PublishStringAsync(topic, data);
        }
    }
}
