using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace AnalyticsService
{
    public static class eKuiperService
    {
        public async static Task ConfigureStream(HttpClient httpClient)
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

        public async static Task ConfigureQuery(HttpClient httpClient)
        {
            try
            {
                var actions = new List<object>();
                actions.Add(new { mqtt = new { server = "tcp://mqtt:1883", topic = "ekuiper-output" } });

                var rule = "select * from detected_earthquakes where magnitude <  5";
                var content = JsonContent.Create<object>(new { id = "rule", sql = rule, actions = actions });
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