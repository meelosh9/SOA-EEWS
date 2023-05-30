namespace AnalyticsService
{
    public class EarthquakeDTO
    {
        public DateTimeOffset Date { get; set; }
        public DateTimeOffset Time { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Type { get; set; }
        public double Depth { get; set; }
        public long Magnitude { get; set; }
        public string MagnitudeType { get; set; }
        public string ID { get; set; }
    }
}
