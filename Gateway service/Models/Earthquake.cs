namespace Gateway_service
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public class Earthquake
    {
        [JsonProperty("_id")]
        public string _id { get; set; }

        [JsonProperty("Date")]
        public DateTimeOffset Date { get; set; }

        [JsonProperty("Time")]
        public DateTimeOffset Time { get; set; }

        [JsonProperty("Latitude")]
        public double Latitude { get; set; }

        [JsonProperty("Longitude")]
        public double Longitude { get; set; }

        [JsonProperty("Type")]
        public string Type { get; set; }

        [JsonProperty("Depth")]
        public double Depth { get; set; }

        [JsonProperty("Magnitude")]
        public long Magnitude { get; set; }

        [JsonProperty("Magnitude Type")]
        public string MagnitudeType { get; set; }

        [JsonProperty("ID")]
        public string ID { get; set; }

    }
}