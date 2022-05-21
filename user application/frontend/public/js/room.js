import * as elements from "./elementsForPopup.js";
import * as popupFunctions from "./popupFunctions.js";
import {makeRequest} from "./index/makeRequest.js";
const roomId = window.location.pathname.split("/")[2];
const buttonAddDevice = document.getElementById("addDevice");
const popupCloseIcon = document.getElementById("close-popup");
const buttonDeleteRoom = document.getElementById("deleteRoom");
buttonDeleteRoom.addEventListener("click", async (e) => {
    await makeRequest(`http://localhost:80/rooms/${roomId}`, "DELETE");
    location.href='/';
});
popupCloseIcon.addEventListener("click", (e) => {
    popupFunctions.closePopup(e)
});

buttonAddDevice.addEventListener("click", async (e) => {
    const currentPopup = document.getElementById("popup");
    currentPopup.classList.add("open");
    const popupContent = currentPopup.querySelector(".popup__content");
    popupContent.append(elements.createFormTitle("Добавить устройство в комнату"));
    const responseForDevices = await fetch("http://localhost:80/devices");
    const devices = await responseForDevices.json();
    const devicesForSelect = devices.map(device => (
        {
            value: device["_id"],
            text: device["name"].value,
        }));
    popupContent.append(elements.createSelect("Выбрать устройство", devicesForSelect, {id: "deviceInRoom"}));
    popupContent.append(elements.createFormButton("Добавить", {id: "addDeviceInRoom"}));
});

document.addEventListener("click", async (e) => {
    if (!e.target) return;
    const idElement = e.target.id;
    if (idElement === "addDeviceInRoom") {
        const deviceId = document.getElementById("deviceInRoom").value;
        const url = `http://localhost:80/rooms/refs/device?roomId=${roomId}&&deviceId=${deviceId}`;
        console.log(url);
        await fetch(url);
        popupFunctions.closePopup(e);
    }
});

