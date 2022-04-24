const axios = require('axios').default;

function getInfoFromUser() {
    return {
        "MAC_address": "mac:mqtt:thermometer001",
    }
}

let motionInfo = () => {
    const infoFromUser = getInfoFromUser();
    const device_id = infoFromUser.MAC_address;
    return {
        "deviceId": "mac:mqtt:thermometer001",
        "entityName": "broker:Thermometer:001",
        "entityType": "Thermometer",
        "transport": "MQTT",
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
        "relationships": [
            {
                "name": "refStore",
                "type": "Relationship",
                "value": "broker:room:001"
            }
        ]
    }
}

const sendPostRequest = async () => {
    try {
        const resp = await axios.delete('http://localhost:4041/devices/mac:mqtt:thermometer001');
        // console.log(resp.data);
    } catch (err) {
        console.log(err.response.status);
        console.log(err.response.data);
    }
};
sendPostRequest();