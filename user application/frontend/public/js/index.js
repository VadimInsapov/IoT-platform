import * as elements from "./elementsForPopup.js";
import * as popupFunctions from "./popupFunctions.js";

const buttonCreateDevice = document.getElementById("createDevice");
const buttonCreateRoom = document.getElementById("createRoom");
const popupCloseIcon = document.getElementById("close-popup");
popupCloseIcon.addEventListener("click", (e) => {
    popupFunctions.closePopup(e)
});
buttonCreateDevice.addEventListener("click", (e) => {
    const currentPopup = document.getElementById("popup");
    currentPopup.classList.add("open");
    const popupContent = currentPopup.querySelector(".popup__content");
    popupContent.append(elements.createFormTitle("Создать устройство"));
    popupContent.append(elements.createInput("Название", ""));
    popupContent.append(elements.createInput("MAC-адрес", ""));
    popupContent.append(elements.createSelect("Выберете модель", ["One", "Two", "Three"]));
    popupContent.append(elements.createInput("Конечная точка", ""));
    popupContent.append(elements.createFormButton("Создать"));
});


buttonCreateRoom.addEventListener("click", (e) => {
    const currentPopup = document.getElementById("popup");
    currentPopup.classList.add("open");
    const popupContent = currentPopup.querySelector(".popup__content");
    popupContent.append(elements.createFormTitle("Создать комнату"));
    popupContent.append(elements.createInput("Название", ""));
    popupContent.append(elements.createInput("Описание", ""));
    popupContent.append(elements.createSelect("Тип комнаты", ["Ванна", "Спальня", "Зал"]));
    popupContent.append(elements.createInput("Ширина", "0", "м", "number"));
    popupContent.append(elements.createInput("Длина", "0", "м", "number"));
    popupContent.append(elements.createInput("Высота", "0", "м", "number"));
    popupContent.append(elements.createFormButton("Создать"));
});

