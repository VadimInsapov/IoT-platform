const axios = require('axios').default;
let lampInfo = () => {
    return {
        "deviceId": "mac:mqtt:door001",
        "entityName": "broker:Door:001",
        "entityType": "Door",
        "transport": "MQTT",
        "commands": [
            {
                "type": "command",
                "name": "open",
            },
            {
                "type": "command",
                "name": "close",
            },
        ],
        "dynamicAttributes": [
            {
                "type": "text",
                "objectId": "st",
                "name": "status"
            }
        ],
    }
}

const sendPostRequest = async () => {
    try {
        const response = await axios.post('http://localhost:4041/devices', lampInfo());
        console.log(response.status);
        console.log(response.data);
    } catch (err) {
        console.log(err.response.status);
        console.log(err.response.data);
    }
};
sendPostRequest();