const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1234');
const random = require('random');
let topic = '/mac:mqtt:motion001/attrs'

client.on('connect', ()=> {
    setInterval(() => {
        const message = {
            c:  String(random.int(0, 1)),
        };
        client.publish(topic, JSON.stringify(message));
        console.log(`${topic} -m ${JSON.stringify(message)}`);
    }, 3000)
})