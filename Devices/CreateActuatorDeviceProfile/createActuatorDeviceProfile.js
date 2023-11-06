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
        "name": "Alarm",
        "manufacturer": "Manufacturer",
        "model": "A-01",
        "labels": [
          "modbus"
        ],
        "description": "Alarm device profile",
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
            "name": "state",
            "description": "Is alarm on or off",
            "properties": {
              "valueType": "String",
              "readWrite": "WR",
            }
          },
        ],
        "deviceCommands":[{
          "name": "values",
          "readWrite": "R",
          "isHidden": false,
          "resourceOperations":[
            { "deviceResource": "station" },
            { "deviceResource": "state" }
          ]
        }]}
      }
    ]
      
    

  axios.post(url, file,{
      headers: {'X-Corelation-ID': requiestID},
    }).then((res) => {
      console.log(res.data);
    }).catch((error) => {
      console.error(error)
    })

}

createDeviceProfile()