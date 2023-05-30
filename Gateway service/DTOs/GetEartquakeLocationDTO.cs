using Gateway_service.Models;
namespace Gateway_service.DTOs
{
    public class GetEartquakeLocationDTO
    {
        public DateTimeOffset Date { get; set; }
        public DateTimeOffset Time { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Type { get; set; }
        public double Depth { get; set; }
        public long Magnitude { get; set; }
        public string MagnitudeType { get; set; }
        public string DisplayName { get; set; }
        public string County { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public GetEartquakeLocationDTO(Earthquake earthquake,Location loc)
        {
            Date = earthquake.Date;
            Time = earthquake.Time;
            Latitude = earthquake.Latitude;
            Longitude = earthquake.Longitude;
            Type = earthquake.Type;
            Depth = earthquake.Depth;
            Magnitude = earthquake.Magnitude;
            MagnitudeType = earthquake.MagnitudeType;
            DisplayName = loc.Name;
            Country = loc.Country;
            CountryCode = loc.CountryCode;
        }
    }

}
