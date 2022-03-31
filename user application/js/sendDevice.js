const axios = require('axios').default;

function getInfoFromUser() {
    return {
        "MAC_address": "mac:thermometer001",
    }
}

let motionInfo = () => {
    const infoFromUser = getInfoFromUser();
    const device_id = infoFromUser.MAC_address;
    return {
        "device_id": "mac:thermometer001",
        "entity_name": "broker:Motion:001",
        "entity_type": "Thermometer001",
        "transport": "MQTT",
        "dynamic_attributes": [
            {
                "type": "number",
                "object_id": "h",
                "name": "humidity"
            },
            {
                "type": "number",
                "object_id": "t",
                "name": "temperature"
            },
        ],
        "static_attributes": [
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
        console.log(resp.data);
    } catch (err) {
        console.error(err);
    }
};
sendPostRequest();