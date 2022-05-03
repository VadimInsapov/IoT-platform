const axios = require('axios').default;
let lampInfo = () => {
    return {
        "deviceId": "mac:mqtt:lamp001",
        "entityName": "broker:Lamp:001",
        "entityType": "Lamp",
        "transport": "MQTT",
        "commands": [
            {
                "type": "command",
                "name": "on",
            },
            {
                "type": "command",
                "name": "off",
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