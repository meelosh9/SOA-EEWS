using AnalyticsService;
using InfluxDB.Client;
using InfluxDB.Client.Api.Domain;
using System;

namespace AnalyticsService
{
    public class InfluxDBService
    {
        private static readonly string TOKEN = "token";
        private static readonly string BUCKET = "detected_earthquakes";
        private static readonly string ORG = "soa_um";
        private static readonly string URL = "http://influx:8086";
        public static void Write(EarthquakeDTO message)
        {
            try
            {
                var influxDBClient = new InfluxDBClient(URL,TOKEN);

                using (var writeApi = influxDBClient.GetWriteApi())
                {
                    var measurement = new EarthquakeMeasurement
                    {
                        Date = message.Date,
                        Time = message.Time,
                        Latitude = message.Latitude,
                        Longitude = message.Longitude,
                        Type = message.Type,
                        Depth = message.Depth,
                        Magnitude = message.Magnitude,
                        MagnitudeType = message.MagnitudeType,
                        ID = message.ID,
                    };

                    writeApi.WriteMeasurement<EarthquakeMeasurement>(measurement, WritePrecision.Ns, BUCKET, ORG);
                    Console.WriteLine("Record added to InfluxDB");
                }

                influxDBClient.Dispose();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
