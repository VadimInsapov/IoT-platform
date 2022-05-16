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
    popupContent.append(elements.createInput("Название", "", {id: "roomName"}));
    popupContent.append(elements.createInput("Описание", "", {id: "roomDescription"}))
    popupContent.append(elements.createSelect(
        "Тип комнаты",
        [{value: "bath", text: "Ванна"}, {value: "bedroom", text: "Спальня"}, {value: "parlor", text: "Зал"}],
        {id: "roomType"}));
    popupContent.append(elements.createInput("Ширина", "0", {
        extraName: "м",
        type: "number",
        id: "roomWeight"
    }));
    popupContent.append(elements.createInput("Длина", "0", {
        extraName: "м",
        type: "number",
        id: "roomLength"
    }));
    popupContent.append(elements.createInput("Высота", "0", {
        extraName: "м",
        type: "number",
        id: "roomHeight"
    }));
    popupContent.append(elements.createFormButton("Создать", {id: "createRoomPopup"}));
});

document.addEventListener("click", async (e) => {
    if (e.target && e.target.id == 'createRoomPopup') {
        const roomName = document.getElementById("roomName").value;
        const roomDescription = document.getElementById("roomDescription").value;
        const roomType = document.getElementById("roomType").value;
        const roomWeight = document.getElementById("roomWeight").value;
        const roomLength = document.getElementById("roomLength").value;
        const roomHeight = document.getElementById("roomHeight").value;
        const room = {
            "type": "Room",
            "attributes": [
                {
                    "roomName": {
                        "type": "text",
                        "value": roomName
                    },
                    "roomType": {
                        "type": "text",
                        "value": roomType
                    },
                    "roomWeight": {
                        "type": "number",
                        "value": roomWeight
                    },
                    "roomLength": {
                        "type": "number",
                        "value": roomLength
                    },
                    "roomHeight": {
                        "type": "number",
                        "value": roomHeight
                    }
                }
            ]
        }
        try {
            const result = await fetch('http://localhost:5500/devices?form=short', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(room)
            });
            console.log(result);
        } catch (error) {
            console.error(error);
        } finally {
            popupFunctions.closePopup(e);
        }
    }
});
