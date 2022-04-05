const axios = require('axios').default;

function getInfoFromUser() {
    return {
        "MAC_address": "mac:mqtt:thermometer001",
    }
}

let motionInfo = () => {
    return {
        "deviceId": "mac:http:thermometer002",
        "entityName": "broker:Thermometer:002",
        "entityType": "Thermometer",
        "transport": "HTTP",
        "dynamicAttributes": [
            {
                "type": "number",
                "objectId": "h",
                "name": "humidity"
            },
            {
                "type": "number",
                "objectId": "t",
                "name": "temperature"
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