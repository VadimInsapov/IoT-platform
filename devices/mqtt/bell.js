const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1234');
const random = require('random');
let topic = '/mac:mqtt:bell001/commands';
console.log("MQTT звонок");
console.log("Расположение Broker-a" + "mqtt://localhost:1234");

client.on('connect', () => {
    client.subscribe(topic);
})
client.on('message', (topic, message) =>{
    console.log("To Do: ");
    console.log(JSON.parse(message));
});
