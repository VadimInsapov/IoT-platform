const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1234');
const random = require('random');
let topic = '/mac:mqtt:thermometer001/attributes';
console.log("MQTT термометр");
console.log("Расположение Broker-a" + "mqtt://localhost:1234");

client.on('connect', ()=>{
    setInterval(() => {
        const message = {
            t: String(random.int(15, 18)),
            h: String(random.int(40, 50)),
        };
        client.publish(topic, JSON.stringify(message))
        console.log(`${topic} -m ${JSON.stringify(message)}`);
    }, 5000)
})