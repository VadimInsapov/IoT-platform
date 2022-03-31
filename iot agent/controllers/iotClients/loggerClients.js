const util = require('util');
exports.got = (client, deviceId, attributes) => console.log(`\nreceived from ${client} id: ${deviceId} attributes: ${util.inspect(attributes, false, null, true)}`);
exports.send = (id, attributes) => console.log(`change to DB id: ${id}, new attributes: ${util.inspect(attributes, false, null, true)}`);

