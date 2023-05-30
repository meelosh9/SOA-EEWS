using Visualisation_Service;
using InfluxDB.Client;
using InfluxDB.Client.Api.Domain;
using System;

namespace Visualisation_Service
{
    public class InfluxDBService
    {
        private static readonly string TOKEN = "token";
        private static readonly string BUCKET = "sensor_data";
        private static readonly string ORG = "soa_eews";
        private static readonly string URL = "http://influx:8086";
        public InfluxDBClient influxDBClient;
        public InfluxDBService()
        {
            influxDBClient = new InfluxDBClient(URL, TOKEN);
        }
        ~InfluxDBService()
        {
            influxDBClient.Dispose();
        }
        public void Write(SensorData message)
        {
            try
            {

                using (var writeApi = influxDBClient.GetWriteApi())
                {
                    var measurement = new SensorMeasurement(message);

                    writeApi.WriteMeasurement<SensorMeasurement>(measurement, WritePrecision.Ns, BUCKET, ORG);
                    //Console.WriteLine(measurement.Dimension_E);
                    //Console.WriteLine("Record added to InfluxDB");
                }

                //influxDBClient.Dispose();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
