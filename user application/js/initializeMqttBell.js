const axios = require('axios').default;
let motionInfo = () => {
    return {
        "deviceId": "mac:mqtt:bell001",
        "entityName": "broker:Bell:001",
        "entityType": "Bell",
        "transport": "MQTT",
        "commands": [
            {
                "type": "command",
                "name": "ring",
            },
        ],
        "staticAttributes": [
            {
                "name": "refStore",
                "type": "text",
                "value": "ss"
            }
        ]
    }
}

const sendPostRequest = async () => {
    try {
        const resp = await axios.post('http://localhost:4041/devices', motionInfo());
    } catch (err) {
        console.log(err.response.status);
        console.log(err.response.data);
    }
};
sendPostRequest();