import mqtt from 'mqtt'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

import WebSocket, { WebSocketServer } from 'ws';

const WEB_SOCKET_PORT_CUSTOMER = 3300;
const ws = new WebSocketServer({ port: WEB_SOCKET_PORT_CUSTOMER });

ws.on('connection', async function connection(ws) {
    console.log('New connection!')
    for (var i = 0; i < alarm.length; i++)
        ws.send(JSON.stringify(alarm[i]))
})


const client = mqtt.connect('tcp://mqtt:1883')

let url = 'http://edgex-core-metadata:59881/api/v2/device'
let requiestID = uuidv4()
let alarm = [{
    name: "alarm01",
    location: { lat: 45.45, long: 47.80 },
    state: "Off"
}, {
    name: "alarm02",
    location: { lat: 35.0, long: 119.0 },
    state: "Off"
}, {
    name: "alarm03",
    location: { lat: 37.95397, long: -121.86554 },
    state: "Off"
},
{
    name: "alarm04",
    location: { lat: -38.95397, long: 80.86554 },
    state: "Off"
},
{
    name: "alarm05",
    location: { lat: 44.0165, long: 21.04 },
    state: "Off"
},
{
    name: "alarm06",
    location: { lat: -33.9249, long: 18.4241 },
    state: "Off"
},
{
    name: "alarm07",
    location: { lat: 40.730610, long: -73.935242 },
    state: "Off"
},
{
    name: "alarm08",
    location: { lat: 41.015137, long: 28.979530 },
    state: "Off"
},
{
    name: "alarm09",
    location: { lat: 19.432608, long: -99.1332094 },
    state: "Off"
},
{
    name: "alarm10",
    location: { lat: -23.533773, long: -46.625290 },
    state: "Off"
},
{
    name: "alarm11",
    location: { lat: 48.864716, long: 2.349014 },
    state: "Off"
}]
let file = []
for (var i = 0; i < alarm.length; i++) {

    file.push({
        "apiVersion": "v2",
        "device": {
            "name": alarm[i].name,
            "description": "Alarm device",
            "adminState": "UNLOCKED",
            "operatingState": "UP",
            "labels": [
                "mqtt", "alarm"
            ],
            "location": alarm[i].location,
            "serviceName": "device-mqtt",
            "profileName": "Alarm",
            "protocols": {
                "mqtt": {
                    "Host": "mqtt",
                    "Port": "1883",
                    "CommandTopic": "alarm/" + alarm[i].name,
                    "Schema": "MQTT",
                    "ClientId": "",
                    "User": ""

                }

            },

            "notify": false
        }

    })
}

axios.post(url, file, {
    headers: { 'X-Corelation-ID': requiestID },
}).then((res) => {
    console.log(res.data);
}).catch((error) => {
    console.error(error)
})

client.on('connect', function () {
    for (var i = 0; i < alarm.length; i++) {
        console.log(alarm[i].name)
        client.subscribe("alarm/" + alarm[i].name + '/#', (err, granted) => {

        });
        client.publish("alarms/" + alarm[i].name, JSON.stringify({ state: alarm[i].state, station: alarm[i].name }));
    }
})
client.on('error', function (error) {
    console.log(error);
})
client.on('reconnect', function () {
    console.log("Reconnecting...");
})
client.on('close', function () {
    console.log("Closed");
})
client.on('disconnect', function () {
    console.log("Disconnected");
})
client.on('message', function (topic, message) {
    const words = topic.split('/');
    var alarmName = words[1];
    var cmd = words[2];
    var method = words[3];
    var uuid = words[4];
    console.log(words.toString())
    console.log(alarmName, cmd, method, uuid)
    var response = {};
    if (method == "set") {
        var data = JSON.parse(message.toString());
        switch (cmd) {
            case "state":
                var index = alarm.findIndex(e => e.name == alarmName)
                console.log(index);
                alarm[index].state = data.state;
                ws.clients.forEach(function each(client) {
                    client.send(JSON.stringify(alarm[index]))
                })
                console.log("State of" + alarm[index].name + " changed to:", data.state);
                break;
            case "station":
                var index = alarm.findIndex(e => e.name == alarmName)
                alarm[index].name = data.station;
                ws.clients.forEach(function each(client) {
                    client.send(JSON.stringify(alarm[index]))
                })
                console.log("Name of" + alarm[index].name + " changed to:", data.station);
                break;

        }

    } else {
        switch (cmd) {
            case "state":
                var index = alarm.findIndex(e => e.name == alarmName)
                response.state = alarm[index].state;
                break;
            case "station":
                response.station = "pong";
                break;
            case "values":
                var index = alarm.findIndex(e => e.name == alarmName)
                response.values = { station: alarm[index].name, state: alarm[index].state };
                break;
        }
    }
    var sendTopic = "command/response/" + uuid;
    client.publish(sendTopic, JSON.stringify(response));
})



