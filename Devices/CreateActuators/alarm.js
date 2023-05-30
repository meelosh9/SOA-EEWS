import mqtt from 'mqtt'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

const client  = mqtt.connect('tcp://mqtt:1883')

let url = 'http://edgex-core-metadata:59881/api/v2/device'
let requiestID = uuidv4()
let alarm = {
    name: "alarm-nodejs-mqtt-v2",
    location: {lat:45.45,long:47.80},
}
let file = [
    {
        "apiVersion": "v2",
        "device": {
        "name": alarm.name,
        "description": "Alarm device",
        "adminState": "UNLOCKED",
        "operatingState": "UP",
        "labels": [
            "mqtt","alarm"
        ],
        "location": alarm.location,
        "serviceName": "device-mqtt",
        "profileName": "Alarm",
        "protocols": {
            "mqtt": {
                "Host":"mqtt",
                "Port":"1883",
                "CommandTopic":alarm.name,
                "Schema":"MQTT",
                "ClientId":"",
                "User":""
                
    }
  },
        
        "notify": false
        }
    }
]

axios.post(url, file,{
    headers: {'X-Corelation-ID': requiestID},
  }).then((res) => {
    console.log(res.data);
  }).catch((error) => {
    console.error(error)
  })


let state = "Off";
let station = alarm.name

client.on('connect', function () {
    client.subscribe( alarm.name+'/#' , (err,granted) => {
        console.log("Subscribed to topic:" +alarm.name+'/#');
        client.publish("alarm", JSON.stringify({state: state, station: station}));
    });
  })
client.on('error', function (error) {
    console.log(error);
    })
client.on('reconnect',function(){
    console.log("Reconnecting...");
})
client.on('close',function(){
    console.log("Closed");
})
client.on('disconnect',function(){
    console.log("Disconnected");
})
client.on('message', function (topic, message) {
    const words = topic.split('/');
        var cmd = words[1];
        var method = words[2];
        var uuid = words[3];
        var response = {};
        if (method == "set") {
            var data = JSON.parse(message.toString());
            switch(cmd) {
                case "state":
                    state = data.state;
                    console.log("State changed to:",state);
                    break;
                case "station":
                    station = data.station;
                    break;
            }
        }else{
            switch(cmd) {
                case "state":
                    response.state = state;
                    break;
                case "station":
                    response.station = "pong";
                    break;
                case "values":
                    response.values = {station: station, state: state};
            }
        }
        // console.log("state:",state,"station",station);
        var sendTopic ="command/response/"+ uuid;
        // console.log(response,"response");
        client.publish( sendTopic, JSON.stringify(response));
})



