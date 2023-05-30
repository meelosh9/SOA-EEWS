using InfluxDB.Client.Core;

namespace Visualisation_Service
{

    [Measurement("Earthquake")]
    public class SensorMeasurement
    {
        [Column("Station", IsTag = true)] public string Station { get; set; }
        [Column("Station_Latitude")] public double Station_Latitude { get; set; }
        [Column("Station_Longitude")] public double Station_Longitude { get; set; }
        [Column("Event_Magnitude")] public double Event_Magnitude { get; set; }
        [Column("Event_Latitude")] public double Event_Latitude { get; set; }
        [Column("Event_Longitude")] public double Event_Longitude { get; set; }
        [Column("Event_Depth")] public double Event_Depth { get; set; }
        [Column("Dimension_E")] public double Dimension_E { get; set; }
        [Column("Dimension_N")] public double Dimension_N { get; set; }
        [Column("Dimension_Z")] public double Dimension_Z { get; set; }
        public SensorMeasurement(SensorData s)
        {
            Station = s.deviceName;
            Station_Latitude = Double.Parse(s.tags.Latitude);
            Station_Longitude = Double.Parse(s.tags.Longitude);
            foreach(Reading r in s.readings)
            {
                switch (r.resourceName)
                {
                    case "event_magnitude":
                        Event_Magnitude = Double.Parse(r.value);
                        break;
                    case "event_longitude":
                        Event_Longitude = Double.Parse(r.value);
                        break;
                    case "event_latitude":
                        Event_Latitude = Double.Parse(r.value);
                        break;
                    case "event_depth":
                        Event_Depth = Double.Parse(r.value);
                        break;
                    case "dimension_n":
                        Dimension_N = Double.Parse(r.value);
                        break;
                    case "dimension_e":
                        Dimension_E = Double.Parse(r.value);
                        break;
                    case "dimension_z":
                        Dimension_Z = Double.Parse(r.value);
                        break;
                }
            }
        }
    }

}
