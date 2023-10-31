import mqtt from 'mqtt'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

import WebSocket, { WebSocketServer } from 'ws';

const WEB_SOCKET_PORT_CUSTOMER = 3301;
const ws = new WebSocketServer({ port: WEB_SOCKET_PORT_CUSTOMER });
ws.on('connection', async function connection(ws) {
    console.log('New connection!')
})

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
// const getAlarmDevices = async () => {
//     let url = 'http://edgex-core-metadata:59881/api/v2/device/all?offset=0&limit=200&labels=industrial'
//     let alarms = []
//     let res = await axios.get(url)
//     for (let i = 0; i < res.data.totalCount; i++) {
//         if (res.data.devices[i].profileName == "Alarm-Device") {
//             console.log(res.data.devices[i])
//             var urlDevice = `http://edgex-core-command:59882/api/v2/device/name/${res.data.devices[i].name}/Location`
//             let resDevice = await axios.get(urlDevice)
//             res.data.devices[i].location.lat = resDevice.data.readings[1]
//             res.data.devices[i].location.long = resDevice.data.readings[0]
//             alarms.push(res.data.devices[i])
//         }
//     }
//     return alarms
// }
function calcCrow(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;

        return dist * 1.609344
    }
}

const getAlarmsInRange = (latitude, longitude, alarms) => {
    let alarmsInRange = []
    alarms.forEach(alarm => {
        var distance = calcCrow(latitude, longitude, alarm.location.lat, alarm.location.long)
        if (distance <= 1000) {
            alarmsInRange.push(alarm)
        }
    });
    return alarmsInRange
}
const getValues = (message) => {
    let obj = {}
    for (let i = 0; i < message.readings.length; i++) {
        switch (message.readings[i].resourceName) {
            case "event_magnitude":
                obj.magnitude = message.readings[i].value
                break
            case "event_latitude":
                obj.latitude = message.readings[i].value
                break
            case "event_longitude":
                obj.longitude = message.readings[i].value
                break
            case "event_depth":
                obj.depth = message.readings[i].value
                break
        }
    }
    return obj
}

let alarmsMQTT = await getAlarmsMQTT()
// let alarmsDevice = await getAlarmDevices()j
let prevEvent = []
const client = mqtt.connect('tcp://mqtt:1883')
console.log("Connecting...");
client.on('connect', function () {
    console.log("Connected");
    client.subscribe('ekuiper-output', (err, granted) => {
        console.log("Subscribed to topic: ekuiper-output");
    });
})
client.on('error', function (error) {
    console.log(error);
})
client.on('reconnect', function () {
    console.log("Reconnecting...");
})
client.on('close', function () {
    console.log("Closed"); s
})
client.on('disconnect', function () {
    console.log("Disconnected");
})
let n = 0
client.on('message', function (topic, message) {
    message = message.toString()
    message = JSON.parse(message)
    let values = getValues(message[0])
    let contains = prevEvent.find(e => e.magnitude == values.magnitude && e.latitude == values.latitude && e.longitude == values.longitude && e.depth == values.depth)
    if (!contains) {
        prevEvent.push(values)
        n++
        console.log("Event detected", n);
        ws.clients.forEach(function each(client) {
            client.send(JSON.stringify(values))
        })
        let alarmsMQTTInRange = getAlarmsInRange(values.latitude, values.longitude, alarmsMQTT)
        // let alarmsDeviceInRange = getAlarmsInRange(values.latitude, values.longitude, alarmsDevice)

        alarmsMQTTInRange.forEach(element => {
            let url = `http://edgex-core-command:59882/api/v2/device/name/${element.name}/state`
            try {
                axios.put(url, { state: "On" })
                setTimeout(() => {
                    axios.put(url, { state: "Off" })
                }, 10000)
            } catch (error) {
                console.log("Error!")
            }
        })

        // alarmsDeviceInRange.forEach(element => {
        //     let url = `http://edgex-core-command:59882/api/v2/device/name/${element.name}/Active`
        //     axios.put(url, { Active: true }).catch()
        //     setTimeout(() => {
        //         axios.put(url, { Active: false }).catch()
        //     }, 10000)
        // })
        // try {
        //     let url = `http:/database_service:5000/api/earthquake/AddEarthquake`
        //     let body = {
        //         date: new Date(),
        //         time: new Date(),
        //         latitude: values.latitude,
        //         longitude: values.longitude,
        //         type: "Earthquake",
        //         depth: values.depth,
        //         magnitude: values.magnitude,
        //         magnitudeType: "MW",
        //         id: uuidv4()
        //     }
        //     axios.post(url, body)
        // } catch (error) {
        // }

    }
})
