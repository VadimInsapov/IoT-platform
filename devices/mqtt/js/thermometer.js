const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1234');
const random = require('random');
let topic = 'thermometer001'

client.on('connect', ()=>{
    setInterval(() => {
        let message = String(random.int(15, 20));
        client.publish(topic, message)
        console.log(`/${topic} -m ${message}`);
    }, 5000)
})