const axios = require('axios').default;

function getInfoFromUser() {
    return {
        "MAC_address": "mac:mqtt:thermometer001",
    }
}

let motionInfo = () => {
    return {
        "deviceId": "mac:mqtt:motion001",
        "entityName": "broker:Motion:001",
        "entityType": "Motion",
        "transport": "MQTT",
        "dynamicAttributes": [
            {
                "type": "number",
                "objectId": "c",
                "name": "count"
            },
        ],
        "staticAttributes": [
            {
                "name": "refStore",
                "type": "relationship",
                "value": "broker:Room:001"
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