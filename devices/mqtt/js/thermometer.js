const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1234');
const random = require('random');
let topic = '/mac:thermometer001/attrs'

client.on('connect', ()=>{
    setInterval(() => {
        const message = {
            t:  String(random.int(15, 20)),
            h:  String(random.int(30, 50)),
        };
        client.publish(topic, JSON.stringify(message))
        console.log(`${topic} -m ${JSON.stringify(message)}`);
    }, 5000)
})