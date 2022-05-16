import * as elements from "./elementsForPopup.js";
import * as popupFunctions from "./popupFunctions.js";
const buttonAddDevice = document.getElementById("addDevice");
const popupCloseIcon = document.getElementById("close-popup");

popupCloseIcon.addEventListener("click", (e) => {
    popupFunctions.closePopup(e)
});

buttonAddDevice.addEventListener("click", (e) => {
    const currentPopup = document.getElementById("popup");
    currentPopup.classList.add("open");
    const popupContent = currentPopup.querySelector(".popup__content");
    popupContent.append(elements.createFormTitle("Добавить устройство в комнату"));
    popupContent.append(elements.createSelect("Выбрать устройство", ["Устройство 1", "Устройство 2", "Устройство 3"]));
    popupContent.append(elements.createFormButton("Добавить"));
});