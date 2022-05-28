import * as elements from "../elementsForPopup.js";
import * as popupFunctions from "../popupFunctions.js";
import {makeRequest} from "./makeRequest.js";

export async function handleCreateDevice(e) {
    const deviceName = document.getElementById("deviceName").value;
    const macAddress = document.getElementById("macAddress").value;
    const deviceModel = document.getElementById("deviceModel").value;
    const device = {
        "name": deviceName,
        "deviceId": macAddress,
        "model": deviceModel,
    }
    if (document.getElementById("endpoint")) {
        device.endpoint =  document.getElementById("endpoint").value;
    }
    console.log(device);
    await makeRequest("http://localhost:80/devices", "POST", device);
    popupFunctions.closePopup(e);
    location.reload();
}

export async function handleCreateRoom(e) {
    const roomName = document.getElementById("roomName").value;
    const roomDescription = document.getElementById("roomDescription").value;
    const room = {
        "type": "room",
        "attributes": [
            {
                "roomName": {
                    "type": "text",
                    "value": roomName
                },
                "roomDescription": {
                    "type": "text",
                    "value": roomDescription
                },
            }
        ]
    }
    try {
        await makeRequest("http://localhost:80/rooms", "POST", room)
    } catch (err) {
        if (err)
            console.log(err)
    }
    popupFunctions.closePopup(e);
    location.reload();
}
