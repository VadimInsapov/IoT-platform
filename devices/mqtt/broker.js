const mosca = require('mosca');
const settings = {port: 1234};
const broker = new mosca.Server(settings);

broker.on('ready', ()=>{
    console.log('Broker is ready!')
})

broker.on('published', (packet, client)=>{
    console.log(`${packet.topic} -m ${packet.payload}`);
})