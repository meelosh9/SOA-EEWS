import fs from "fs";
import { parse } from "csv-parse";
import axios from 'axios'
import { v4 as uuidv4 } from "uuid";

const Write = (data, delay) => {
  
  let origin = parseInt(data.timestamp)
  let url = `http://edgex-core-data:59880/api/v2/event/SeismicSensor/${data.station}/${data.station}`
  let requiestID = uuidv4()
  let body = {
    "apiVersion": "v2",
    "event": {
      "apiVersion": "v2",
      "id": requiestID,
      "deviceName": data.station,
      "profileName": "SeismicSensor",
      "sourceName": data.station,
      "origin": origin,
      "tags": {
        "Latitude": data.station_latitude,
        "Longitude": data.station_longitude,
      },
      "readings": [
        {
          "id": requiestID,
          "origin": origin,
          "deviceName": data.station,
          "resourceName": "event_magnitude",
          "profileName": "SeismicSensor",
          "valueType": "Float64",
          "value": data.event_magnitude
        },
        {
          "id": requiestID,
          "origin": origin,
          "deviceName": data.station,
          "resourceName": "event_longitude",
          "profileName": "SeismicSensor",
          "valueType": "Float64",
          "value": data.event_longitude
        },
        {
          "id": requiestID,
          "origin": origin,
          "deviceName": data.station,
          "resourceName": "event_latitude",
          "profileName": "SeismicSensor",
          "valueType": "Float64",
          "value": data.event_latitude
        },
        {
          "id": requiestID,
          "origin": origin,
          "deviceName": data.station,
          "resourceName": "event_depth",
          "profileName": "SeismicSensor",
          "valueType": "Float64",
          "value": data.event_depth
        },
        {
          "id": requiestID,
          "origin": origin,
          "deviceName": data.station,
          "resourceName": "dimension_n",
          "profileName": "SeismicSensor",
          "valueType": "Float64",
          "value": data.dimension_N
        },
        {
          "id": requiestID,
          "origin": origin,
          "deviceName": data.station,
          "resourceName": "dimension_e",
          "profileName": "SeismicSensor",
          "valueType": "Float64",
          "value": data.dimension_E
        },
        {
          "id": requiestID,
          "origin": origin,
          "deviceName": data.station,
          "resourceName": "dimension_z",
          "profileName": "SeismicSensor",
          "valueType": "Float64",
          "value": data.dimension_Z
        }
      ]

    }
  }

  setTimeout(() => {
    console.log(delay,data.station)
    axios.post(url, body, {
      headers: { 'X-Corelation-ID': requiestID },
    }).then((res) => {
      // console.log(res.data);
    }).catch((error) => {
      // console.error(error)
    })
  }, delay);
}

const createDevices = async (datasets) => {
  let url = 'http://edgex-core-metadata:59881/api/v2/device'
  for (var i = 0; i < datasets.length; i++) {
    let requiestID = uuidv4()
    var stationDevice = [
      {
        "apiVersion": "v2",
        "device": {
          "name": datasets[i][0].station,
          "description": "Seismometer station",
          "adminState": "UNLOCKED",
          "operatingState": "UP",
          "labels": [
            "sensor", "seismometer"
          ],
          "location": `{lat:${45.45},long:${47.80}}`,
          "serviceName": "device-rest",
          "profileName": "SeismicSensor",
          "protocols": {
            "http": {
            }
          },

          "notify": false
        }
      }
    ]
    await axios.post(url, stationDevice, {
      headers: { 'X-Corelation-ID': requiestID },
    })
  };

}

const LoadData = (filename) => {
  let datasets = []
  let currnetStation = ""
  let first = true;
  let stationData = []
  let stationNumber = 0
  fs.createReadStream(filename)
    .pipe(parse({ delimiter: ",", from_line: 1, columns: true }))
    .on('data', chunk => {
      if (first) {
        currnetStation = chunk.station
        first = false
        datasets.push([])
      }
      if (currnetStation != chunk.station) {
        datasets.push(stationData)
        stationData = []
        currnetStation = chunk.station
        stationNumber++
      }
      datasets[stationNumber].push(chunk)
    })
    .on("end", async function () {
      await createDevices(datasets)
      SendData(datasets)
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}
const SendData = (stations) => {
  console.log(stations.length);
  let delay = 0
  for (var i = 0; i < stations.length; i++) {
    for (var j = 0; j < stations[i].length; j++) {
      delay += 200
      Write(stations[i][j], delay)
    }

  };
}
LoadData("./Dataset_GPS.csv")
