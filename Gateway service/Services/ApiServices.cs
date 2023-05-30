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
namespace Gateway_service.Services
{
    public class ApiServices
    {
        public async Task<Location> PositionStackGetLocation(HttpClient client,double latitude, double longitude)
        {
            var requestApi = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"http://api.positionstack.com/v1/reverse?access_key=53394c38a53445d672b060e68e01cfd8&query={latitude},{longitude}"),
            };
            var responceApi = await client.SendAsync(requestApi);
            responceApi.EnsureSuccessStatusCode();
            var bodyApi = await responceApi.Content.ReadAsStringAsync();

            var jsonSerializerSettings = new JsonSerializerSettings();
            jsonSerializerSettings.MissingMemberHandling = MissingMemberHandling.Ignore;

            var locations = JsonConvert.DeserializeObject<Data>(bodyApi, jsonSerializerSettings);
            return locations.data[0];
        }
    }
}
