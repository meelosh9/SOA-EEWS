using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using MQTTnet;
using MQTTnet.Client;
using Gateway_service.Models;
using Gateway_service.DTOs;
using Gateway_service.Services;

namespace Gateway_service.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EarthquakeController : ControllerBase
    {

        private readonly ILogger<EarthquakeController> _logger;
        private HttpClient httpClient;
        private ApiServices apiServices;
        private MQTTService mqttService;
        private IMqttClient mQTTClient;
        public EarthquakeController(ILogger<EarthquakeController> logger)
        {
            _logger = logger;
            httpClient = new HttpClient();
            apiServices = new ApiServices();
            mqttService = new MQTTService();
            mQTTClient = mqttService.CreateMqttClient();
        }

        public static string ConvertToISO6709(double latitude, double longitude)
        {
            string latDirection = (latitude >= 0) ? "+" : "-";
            string lonDirection = (longitude >= 0) ? "+" : "-";

            string latStr = latitude.ToString("0.#######").Replace(",", ".");
            string lonStr = longitude.ToString("0.#######").Replace(",", ".");

            return $"{latDirection}{latStr}{lonDirection}{lonStr}/";
        }

        [HttpGet("GetEarthquakesOfMagnitudeGT")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetEarthquakesOfMagnitudeGT([FromQuery] float Magnitude)
        {
            try
            {
                if (Magnitude < 0)
                {
                    return BadRequest("Search magnitude needs to be greater than 0.");
                }
                var requestDB = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri($"http://database_service:5000/api/earthquake/GetLatestEarthquakesOfMagnitudeGT/{Magnitude}"),
                };
                var responceDB = await httpClient.SendAsync(requestDB);
                responceDB.EnsureSuccessStatusCode();
                var bodyDB = await responceDB.Content.ReadAsStringAsync();
                if (bodyDB == "[]")
                    return NotFound();
                List<Earthquake> earthquakeData = JsonConvert.DeserializeObject<List<Earthquake>>(bodyDB);
                Location locationData = await apiServices.PositionStackGetLocation(httpClient, earthquakeData[0].Latitude, earthquakeData[0].Longitude);

                GetEartquakeLocationDTO responce = new GetEartquakeLocationDTO(earthquakeData[0], locationData);

                return Ok(responce);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.ToString());
            }
        }
        [HttpGet("GetEarthquakesInArea")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetEarthquakesInArea([FromQuery] double Latitude1, double Latitude2, double Longitude1, double Longitude2)
        {
            try
            {
                if (Latitude1 >= 90 && Latitude1 <= -90 ||
                    Latitude2 >= 90 && Latitude2 <= -90 ||
                    Longitude1 >= 180 && Longitude1 <= -180 ||
                    Longitude2 >= 180 && Longitude2 <= -180)
                {
                    return BadRequest("Search latitude and longitude values invalid (lat range(90,-90), lon range(180,-180)");
                }
                var requestDB = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri($"http://database_service:5000/api/earthquake/GetEarthquakesInArea/{Latitude1}/{Latitude2}/{Longitude1}/{Longitude2}"),
                };
                var responceDB = await httpClient.SendAsync(requestDB);
                responceDB.EnsureSuccessStatusCode();
                var bodyDB = await responceDB.Content.ReadAsStringAsync();
                if (bodyDB == "[]")
                    return NotFound();
                List<Earthquake> earthquakeData = JsonConvert.DeserializeObject<List<Earthquake>>(bodyDB);
                Location locationData = await apiServices.PositionStackGetLocation(httpClient, earthquakeData[0].Latitude, earthquakeData[0].Longitude);
                GetEartquakeLocationDTO responce = new GetEartquakeLocationDTO(earthquakeData[0], locationData);
                return Ok(responce);
            }
            catch (Exception e)
            {
                return StatusCode(500, "An error has occured.");
            }
        }

        [HttpGet("GetEarthquakesByDate")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetEarthquakesByDate([FromQuery] DateTime date)
        {
            try
            {
                var requestDB = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri($"http://database_service:5000/api/earthquake/GetEarthquakesByDate/{date.ToString("yyyy-MM-ddTHH:mm:ss.sssZ")}"),
                };
                var responceDB = await httpClient.SendAsync(requestDB);
                responceDB.EnsureSuccessStatusCode();
                var bodyDB = await responceDB.Content.ReadAsStringAsync();
                if (bodyDB == "[]")
                    return NotFound();
                List<Earthquake> earthquakeData = JsonConvert.DeserializeObject<List<Earthquake>>(bodyDB);
                Location locationData = await apiServices.PositionStackGetLocation(httpClient, earthquakeData[0].Latitude, earthquakeData[0].Longitude);
                GetEartquakeLocationDTO responce = new GetEartquakeLocationDTO(earthquakeData[0], locationData);
                return Ok(responce);

            }
            catch (Exception e)
            {
                return StatusCode(500, "An error has occured.");
            }
        }

        [HttpPost("AddEarthquake")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AddEarthquake([FromBody] PostEarthquakeDTO earthquake)
        {
            try
            {
                var requestDB = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri($"http://database_service:5000/api/earthquake/AddEarthquake"),
                    Content = JsonContent.Create(earthquake)
                    
            };
                var responceDB = await httpClient.SendAsync(requestDB);
                responceDB.EnsureSuccessStatusCode();
                if (responceDB.IsSuccessStatusCode)
                {
                    mqttService.PublishEarthquake(mQTTClient, "detected_earthquakes", JsonConvert.SerializeObject(earthquake));
                    return Ok();
                }
                else 
                    return BadRequest();
            }
            catch (Exception e)
            {
                return StatusCode(500, "An error has occured.");
            }
        }

        [HttpPut("UpdateEarthquake")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateEarthquake([FromBody] Earthquake earthquake)
        {
            try{
                var requestDB = new HttpRequestMessage
                {
                    Method = HttpMethod.Put,
                    RequestUri = new Uri($"http://database_service:5000/api/earthquake/UpdateEarthquake"),
                    Content = JsonContent.Create(earthquake)

                };
                var responceDB = await httpClient.SendAsync(requestDB);
                responceDB.EnsureSuccessStatusCode();
                if (responceDB.IsSuccessStatusCode)
                    return Ok();
                else
                    return BadRequest();
            }
            catch (Exception e)
            {
                return StatusCode(500, "An error has occured.");
            }
        }

        [HttpDelete("DeleteEarthquake")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteEarthquake([FromQuery] string _id)
        {
            try
            {
                var requestDB = new HttpRequestMessage
                {
                    Method = HttpMethod.Delete,
                    RequestUri = new Uri($"http://database_service:5000/api/earthquake/DeleteEarthquake/{_id}"),

                };
                var responceDB = await httpClient.SendAsync(requestDB);
                responceDB.EnsureSuccessStatusCode();
                if (responceDB.IsSuccessStatusCode)
                    return Ok();
                else
                    return BadRequest();
            }
            catch (Exception e)
            {
                return StatusCode(500, "An error has occured.");
            }
        }
    }

}