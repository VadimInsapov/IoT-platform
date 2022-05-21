import * as elements from "./elementsForPopup.js";
import * as popupFunctions from "./popupFunctions.js";

const buttonAddDevice = document.getElementById("addDevice");
const popupCloseIcon = document.getElementById("close-popup");

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
    popupContent.append(elements.createSelect("Выбрать устройство", devicesForSelect,{id: "device"}));
    popupContent.append(elements.createFormButton("Добавить"));
});