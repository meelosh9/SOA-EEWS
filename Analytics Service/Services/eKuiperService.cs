using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace AnalyticsService
{
    public static class eKuiperService
    {
        public async static Task ConfigureStreamApiInput(HttpClient httpClient)
        {
            try
            {
                var streamCommand = "create stream detected_earthquakes(data string,time string,latitude bigint,longitude bigint,type string,depth bigint,magnitude bigint,magnitudetype string, id string) " +
                    "WITH(datasource = \"detected_earthquakes\", FORMAT = \"json\")";
                var content = JsonContent.Create<object>(new { sql = streamCommand });
                using (var response = await httpClient.PostAsync("/streams", content))
                {
                    Console.WriteLine(response.StatusCode);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async static Task ConfigureStreamSensorInput(HttpClient httpClient)
        {
            try
            {
                var streamCommand = "create stream edgexinput() " +
                    "WITH(datasource = \"EdgeXEvents\", FORMAT = \"json\")";
                var content = JsonContent.Create<object>(new { sql = streamCommand });
                using (var response = await httpClient.PostAsync("/streams", content))
                {
                    Console.WriteLine(response.StatusCode);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }



        public async static Task ConfigureQueryApiInput(HttpClient httpClient)
        {
            try
            {
                var actions = new List<object>();
                actions.Add(new { mqtt = new { server = "tcp://mqtt:1883", topic = "ekuiper-output" } });
                var rule = "select * from detected_earthquakes where magnitude > 5.0";
                var content = JsonContent.Create<object>(new { id = "apiRule", sql = rule, actions = actions });
                using (var response = await httpClient.PostAsync("/rules", content))
                {
                    Console.WriteLine(response.StatusCode);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
        public async static Task ConfigureQuerySensorInput(HttpClient httpClient)
        {
            try
            {
                var actions = new List<object>();
                actions.Add(new { mqtt = new { server = "tcp://mqtt:1883", topic = "ekuiper-output" } });
                var rule = "select * from edgexinput where profileName = \"SeismicSensor\" and cast(edgexinput.readings[0]->value,\"float\") > 5.0";
                var content = JsonContent.Create<object>(new { id = "sensorRule", sql = rule, actions = actions });
                using (var response = await httpClient.PostAsync("/rules", content))
                {
                    Console.WriteLine(response.StatusCode);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}