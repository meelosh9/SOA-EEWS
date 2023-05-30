import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const createDeviceProfile = async () => {
  let url = 'http://edgex-core-metadata:59881/api/v2/deviceprofile'
  let requiestID = uuidv4()
  var file =  
    [
    {
      "requestId": requiestID,
      "apiVersion": "v2",
      "profile": {
        "name": "SeismicSensor",
        "manufacturer": "Elektronska Industrija Nis",
        "model": "SS-01",
        "labels": [
          "modbus"
        ],
        "description": "Senzor za detekciju pomeraja",
        "deviceResources": [
          {
            "name": "station",
            "description": "Station name",
            "properties": {
              "valueType": "String",
              "readWrite": "RW",
            }
          },
          {
            "name": "event_id",
            "description": "event_id",
            "properties": {
              "valueType": "float64",
              "readWrite": "R",
            }
          },{
            "name": "event_time",
            "description": "event_time",
            "properties": {
              "valueType": "String",
              "readWrite": "RW",
            }
          },
          {
            "name": "event_magnitude",
            "description": "event_magnitude",
            "properties": {
              "valueType": "float64",
              "readWrite": "RW",
            }
          },
          {
            "name": "event_longitude",
            "description": "event_longitude",
            "properties": {
              "valueType": "float64",
              "readWrite": "R",
            }
          },{
            "name": "event_latitude",
            "description": "event_latitude",
            "properties": {
              "valueType": "float64",
              "readWrite": "RW",
            }
          },
          {
            "name": "event_depth",
            "description": "event_depth",
            "properties": {
              "valueType": "float64",
              "readWrite": "R",
            }
          },{
            "name": "dimension_n",
            "description": "Station name",
            "properties": {
              "valueType": "float64",
              "readWrite": "RW",
            }
          },
          {
            "name": "dimension_e",
            "description": "Station name",
            "properties": {
              "valueType": "float64",
              "readWrite": "R",
            }
          },
          {
            "name": "dimension_z",
            "description": "Station name",
            "properties": {
              "valueType": "float64",
              "readWrite": "R",
            }
          },
        ]
      }
    }]

  axios.post(url, file,{
      headers: {'X-Corelation-ID': requiestID},
    }).then((res) => {
      console.log(res.data);
    }).catch((error) => {
      console.error(error)
    })

}

createDeviceProfile()