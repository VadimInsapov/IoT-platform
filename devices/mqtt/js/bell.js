const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1234');
const random = require('random');
let topic = '/mac:mqtt:bell001/commands';


client.on('connect', () => {
    client.subscribe(topic);
})
client.on('message', (topic, message) =>{
    console.log("Сделать");
    console.log(JSON.parse(message));
});
