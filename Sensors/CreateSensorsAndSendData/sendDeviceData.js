import fs  from "fs";
import { parse } from "csv-parse";
import axios from 'axios'
import { v4 as uuidv4 } from "uuid";

const Write = (data, delay) => {
  let origin =  parseInt(data.timestamp)
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
        "value":  data.dimension_E
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
 
  axios.post(url, body,{
    headers: {'X-Corelation-ID': requiestID},
  }).then((res) => {
    // console.log(res.data);
  }).catch((error) => {
    // console.error(error)
  })
  // setTimeout(() => {
    // axios.post(url, body,{
    //   headers: {'X-Corelation-ID': requiestID},
    // }).then((res) => {
    //   // console.log(res.data);
    // }).catch((error) => {
    //   // console.error(error)
    // })
  // }, delay);
}

const createDevices = async (datasets) => {
  let url = 'http://edgex-core-metadata:59881/api/v2/device'
  datasets.forEach(data => {
    let requiestID = uuidv4()
    var stationDevice = [
      {
        "apiVersion": "v2",
        "device": {
          "name": data[0].station,
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
    axios.post(url, stationDevice, {
      headers: { 'X-Corelation-ID': requiestID },
    }).then((res) => {
      // console.log(res.data);
    }).catch((error) => {
      console.error(error)
    })
  });
  
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
    .on("end", function () {
      // createDevices(datasets)
      SendData(datasets)
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}
const SendData = (stations) => {
  console.log(stations.length);
  stations.forEach(element => {
    let delay = 0
    element.forEach(data => {
      Write(data,1)
      delay += 1
    })
  });
}
LoadData("./bkbdm.csv")
