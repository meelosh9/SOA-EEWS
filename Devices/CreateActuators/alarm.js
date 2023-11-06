import mqtt from 'mqtt'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

import { WebSocketServer } from 'ws';
const ws = new WebSocketServer({ port: 3300 });

const getAlarmsMQTT = async () => {
    let url = 'http://edgex-core-metadata:59881/api/v2/device/all?offset=0&limit=200&labels=mqtt'
    let alarms = []
    let res = await axios.get(url)
    for (let i = 0; i < res.data.totalCount; i++) {
        if (res.data.devices[i].profileName == "Alarm") {
            alarms.push(res.data.devices[i])
        }
    }
    return alarms
}
const CreateBaseAlamrs = async () => {
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
    await axios.post(url, file, {
        headers: { 'X-Corelation-ID': requiestID },
    }).then((res) => {
        console.log("Ucitani podaci");
    }).catch((error) => {
        console.error(error)
    })
}
const GetInitlaAlamrs = async () => {
    let alarmsMQTT = await getAlarmsMQTT()
    let inital = []
    console.log("Number of active alarms is: " + alarmsMQTT.length);
    for (var i = 0; i < alarmsMQTT.length; i++) {
        inital.push({
            name: alarmsMQTT[i].name,
            location: alarmsMQTT[i].location,
            state: "Off"
        })
    }
    return inital
}
const CheckForNewAlamrs = async (alarms) => {
    console.log("Provera za nove")
    setTimeout(() => { CheckForNewAlamrs(alarms) }, 3000)
    let alarmsMQTT = await getAlarmsMQTT()
    if (alarmsMQTT.length == alarms.length) {
        return
    }
    else if (alarmsMQTT.length > alarms.length) {
        for (var i = 0; alarmsMQTT.length; i++) {
            if (!alarms.some(item => alarmsMQTT[i].name == item.name))
                alarms.push({
                    name: alarmsMQTT[i].name,
                    location: alarmsMQTT[i].location,
                    state: "Off"
                })
        }
    } else {
        for (var i = 0; alarms.length; i++) {
            if (!alarmsMQTT.some(item => alarms[i].name == item.name))
                alarms.removeWhere(item => item.name == alarms[i].name)

        }
    }
    client.on('connect', function () {
        for (var i = 0; i < alarm.length; i++) {
            client.subscribe("alarm/" + alarm[i].name + '/#', (err, granted) => {
            });
            client.publish("alarms/" + alarm[i].name, JSON.stringify({ state: alarm[i].state, station: alarm[i].name }));
        }
    })
}

let alarm = []

await CreateBaseAlamrs()
alarm = await GetInitlaAlamrs()
setTimeout(() => { CheckForNewAlamrs(alarm) }, 1000)

const client = mqtt.connect('tcp://mqtt:1883')

client.on('connect', function () {
    for (var i = 0; i < alarm.length; i++) {
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
    var response = {};
    if (method == "set") {
        var data = JSON.parse(message.toString());
        switch (cmd) {
            case "state":
                var index = alarm.findIndex(e => e.name == alarmName)
                alarm[index].state = data.state;
                ws.clients.forEach(function each(client) {
                    client.send(JSON.stringify(alarm[index]))
                })
                console.log("State of " + alarm[index].name + " changed to:", data.state);
                break;
            case "station":
                var index = alarm.findIndex(e => e.name == alarmName)
                alarm[index].name = data.station;
                ws.clients.forEach(function each(client) {
                    client.send(JSON.stringify(alarm[index]))
                })
                console.log("Name of " + alarm[index].name + " changed to:", data.station);
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
ws.on('connection', async function connection(ws) {
    console.log('New connection!')
    for (var i = 0; i < alarm.length; i++)
        ws.send(JSON.stringify(alarm[i]))
})
