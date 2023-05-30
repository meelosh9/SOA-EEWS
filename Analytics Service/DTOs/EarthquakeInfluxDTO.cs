using InfluxDB.Client.Core;

namespace AnalyticsService
{

    [Measurement("Earthquake")]
    public class EarthquakeMeasurement
    {

        [Column("Date")] public DateTimeOffset Date { get; set; }
        [Column("Time")] public DateTimeOffset Time { get; set; }
        [Column("Latitude")] public double Latitude { get; set; }
        [Column("Longitude")] public double Longitude { get; set; }
        [Column("Type", IsTag = true)] public string Type { get; set; }
        [Column("Depth")] public double Depth { get; set; }
        [Column("Magnitude")] public long Magnitude { get; set; }
        [Column("MagnitudeType", IsTag = true)] public string MagnitudeType { get; set; }
        [Column("ID")] public string ID { get; set; }
    }

}
