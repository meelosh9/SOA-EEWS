import mqtt from 'mqtt'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

const getAlarms = async () => {
    let url = 'http://edgex-core-metadata:59881/api/v2/device/all?offset=0&limit=200&labels=mqtt'
    let alarms = []
    let res = await axios.get(url)
    for(let i = 0; i < res.data.totalCount; i++){
            if (res.data.devices[i].profileName == "Alarm"){
                alarms.push(res.data.devices[i])
            }
    }
        return alarms
}
function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
}
function toRad(Value) 
    {
        return Value * Math.PI / 180;
}

const findAlarms = (magnitude, latitude, longitude,alarms) => {
    let alarmsInRange = []
    let range = Math.pow(magnitude,10) / 100
    alarms.forEach(alarm => {
        if (calcCrow(latitude,longitude,alarm.location.lat,alarm.location.long) <= range){
            // console.log(range,calcCrow(latitude,longitude,alarm.location.lat,alarm.location.long));
            alarmsInRange.push(alarm)
        }
    });
    return alarmsInRange
}
const getValues = (message) => {
    let obj = {}
    for(let i = 0; i < message.readings.length; i++){
        switch(message.readings[i].resourceName){
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
let allAlarms = await getAlarms()
let prevEvent = []
const client  = mqtt.connect('tcp://mqtt:1883')
console.log("Connecting...");
client.on('connect', function () {
    console.log("Connected");
    client.subscribe( 'EdgeXEvents' , (err,granted) => {
        console.log("Subscribed to topic: EdgeXEvents");
    });
})
client.on('error', function (error) {
    console.log(error);
})
client.on('reconnect',function(){
    console.log("Reconnecting...");
})
client.on('close',function(){
    console.log("Closed");s
})
client.on('disconnect',function(){
    console.log("Disconnected");
})
let n = 0
client.on('message', function (topic, message) {
    message = message.toString()
    message = JSON.parse(message)
    let values = getValues(message)
    let contains = prevEvent.find(e => e.magnitude == values.magnitude && e.latitude == values.latitude && e.longitude == values.longitude && e.depth == values.depth )
    if (!contains && values.magnitude >= 3){
        prevEvent.push(values)
        n++
        console.log("Event detected",n);
        let alamrsInRange = findAlarms(values.magnitude,values.latitude,values.longitude,allAlarms)
        alamrsInRange.forEach(element => {
            let url = `http://edgex-core-command:59882/api/v2/device/name/${element.name}/state`
            axios.put(url, {state: "On"}).catch()
        })
        let url = `http:/database_service:5000/api/earthquake/AddEarthquake`
        let body = {
            date: new Date(),
            time: new Date(),
            latitude: values.latitude,
            longitude: values.longitude,
            type: "Earthquake",
            depth:values.depth,
            magnitude:values.magnitude, 
            magnitudeType:"MW",
            id: uuidv4()
        }
        axios.post(url,body).catch(err => console.log(err))
    }
})
