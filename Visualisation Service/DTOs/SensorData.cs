using Newtonsoft.Json;
namespace Visualisation_Service
{
    public class Reading
    {
        public string id { get; set; }
        public long origin { get; set; }
        public string deviceName { get; set; }
        public string resourceName { get; set; }
        public string profileName { get; set; }
        public string valueType { get; set; }
        public object binaryValue { get; set; }
        public string mediaType { get; set; }
        public string value { get; set; }
    }

    public class SensorData
    {
        public string apiVersion { get; set; }
        public string id { get; set; }
        public string deviceName { get; set; }
        public string profileName { get; set; }
        public string sourceName { get; set; }
        public long origin { get; set; }
        public List<Reading> readings { get; set; }
        public Tags tags { get; set; }
    }

    public class Tags
    {
        public string Latitude { get; set; }
        public string Longitude { get; set; }
    }
 //  public class SensorData
 //  {
 //      [JsonProperty("station")]
 //      public string Station { get; set; }
 //
 //      [JsonProperty("station_latitude")]
 //      public string Station_Latitude { get; set; }
 //
 //      [JsonProperty("station_longitude")]
 //      public string Station_Longitude { get; set; }
 //
 //      [JsonProperty("event_id")]
 //      public int Event_ID { get; set; }
 //
 //      [JsonProperty("event_magnitude")]
 //      public double Event_Magnitude { get; set; }
 //
 //      [JsonProperty("event_latitude")]
 //      public double Event_Latitude { get; set; }
 //
 //      [JsonProperty("event_longitude")]
 //      public double Event_Longitude { get; set; }
 //
 //      [JsonProperty("event_depth")]
 //      public double Event_Depth { get; set; }
 //
 //      [JsonProperty("event_time")]
 //      public string Event_Time { get; set; }
 //
 //      [JsonProperty("dimension_E")]
 //      public double Dimension_E { get; set; }
 //
 //      [JsonProperty("dimension_N")]
 //      public double Dimension_N { get; set; }
 //
 //      [JsonProperty("dimension_Z")]
 //      public double Dimension_Z { get; set; }
 //
 //      [JsonProperty("mts_id")]
 //      public long MTS_ID { get; set; }
 //

    //}
}
