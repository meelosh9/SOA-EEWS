<template>
  <body>
    <a v-mdb-ripple="{ color: 'light', radius: 25 }">
      <img alt="example" id="map" class="img-fluid rounded" width="1000"
      src="https://miro.medium.com/v2/resize:fit:2400/format:webp/1*OaEjVmZCTgmVeAE68VFS8w.jpeg"
      margin: auto />
    </a>
  </body>
</template>

<script>
import { mdbRipple } from "mdb-vue-ui-kit";

/* The following functions take or return their results in degrees */
function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
function latLonToOffsets(latitude, longitude, mapWidth, mapHeight) {
  const FE = 180; // false easting
  const radius = mapWidth / (2 * Math.PI);

  const latRad = degreesToRadians(latitude);
  const lonRad = degreesToRadians(longitude + FE);

  const x = lonRad * radius;

  const yFromEquator = radius * Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = mapHeight / 2 - yFromEquator;

  return { x, y };
}
function drawStation(latitude, longitude, state, name) {
  var image = document.getElementById("map");
  var rect = image.getBoundingClientRect();
  const mapWidth = image.clientWidth;
  const mapHeight = image.clientHeight;
  const { x, y } = latLonToOffsets(latitude, longitude, mapWidth, mapHeight);
  var color = state == "On" ? "lightGreen" : "red";
  var offset = 4;
  var size = offset * 2 + "px";
  var div = document.createElement("div");
  div.id = name;
  div.style.position = "absolute";
  div.style.top = rect.top + y - offset + "px";
  div.style.left = rect.left + x - offset + "px";
  div.style.width = size;
  div.style.height = size;
  div.style.backgroundColor = color;
  div.style.borderRadius = offset + "px";
  div.style.borderWidth = "thin";
  var hoverText = "Lat: " + latitude + " Lon: " + longitude;

  // Add the event listeners for the mouseover and mouseout events
  div.addEventListener("mouseover", function () {
    div.title = hoverText;
  });
  div.addEventListener("mouseout", function () {
    div.title = "";
  });
  document.body.appendChild(div);
}
function drawEarthquareSource(latitude, longitude) {
  var image = document.getElementById("map");
  var rect = image.getBoundingClientRect();
  const mapWidth = image.clientWidth;
  const mapHeight = image.clientHeight;
  const { x, y } = latLonToOffsets(latitude, longitude, mapWidth, mapHeight);
  var offset = 4;
  var div = document.createElement("div");
  div.style.zIndex = 1000;
  div.style.position = "absolute";
  div.style.top = rect.top + y - offset + "px";
  div.style.left = rect.left + x - offset + "px";
  div.classList.add("circle", "orange", "pulse");
  document.body.appendChild(div);
  setTimeout(() => {
    console.log("brisem point");
    document.body.removeChild(div);
  }, 10000);
}

export default {
  directives: {
    mdbRipple,
  },

  data() {
    return {};
  },
  created() {
    this.createConnectionEarthquakes();
    this.createConnectionStations();
  },
  methods: {
    initData() {},
    createConnectionStations() {
      try {   
        const wsStations = new WebSocket("ws://localhost:3300"); //TODO Device
        wsStations.onopen = async () => {};
        wsStations.onmessage = async (event) => {
          let message = JSON.parse(event.data);
          console.log(message);
          drawStation(
            message.location.lat,
            message.location.long,
            message.state,
            message.name
          );
        };
        wsStations.onclose = async (e) => {
          this.createConnectionStations();
        };
      } catch (error) {
        e;
        console.log("Ws connect error", error);
      }
    },
    createConnectionEarthquakes() {
      try {
        const wsEarthquakes = new WebSocket("ws://localhost:3301"); //TODO motnitoring_service
        wsEarthquakes.onopen = async () => {};
        wsEarthquakes.onmessage = async (event) => {
          let message = JSON.parse(event.data);
          console.log(message);
          Number.parseFloat();
          drawEarthquareSource(
            Number.parseFloat(message.latitude),
            Number.parseFloat(message.longitude)
          );
        };
        wsEarthquakes.onclose = async (e) => {
          this.createConnectionEarthquakes();
        };
      } catch (error) {
        console.log("Ws connect error", error);
      }
    },
  },
};
</script>
<style scoped>
body {
  height: 100vh;
  width: 100vw;
  background-color: rgba(140, 189, 236, 0.623);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>