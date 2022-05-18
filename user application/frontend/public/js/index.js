import * as elements from "./elementsForPopup.js";
import * as popupFunctions from "./popupFunctions.js";

const buttonCreateDevice = document.getElementById("createDevice");
const buttonCreateRoom = document.getElementById("createRoom");
const popupCloseIcon = document.getElementById("close-popup");
const selectDeviceFilter = document.getElementById("deviceFilter");

const responseForModels = await fetch("http://localhost:80/models");
const models = await responseForModels.json();

popupCloseIcon.addEventListener("click", (e) => {
    popupFunctions.closePopup(e)
});
buttonCreateDevice.addEventListener("click", async (e) => {
    const currentPopup = document.getElementById("popup");
    currentPopup.classList.add("open");
    const popupContent = currentPopup.querySelector(".popup__content");
    popupContent.append(elements.createFormTitle("Создать устройство"));
    popupContent.append(elements.createInput("Название", "", {id: "deviceName"}));
    popupContent.append(elements.createInput("MAC-адрес", "", {id: "macAddress"}));
    const modelsInSelect = models.map(item => ({value: item.name, text: item.name}));
    const selectWithModels = elements.createSelect(
        "Выберете модель",
        modelsInSelect,
        {id: "deviceModel"}
    )
    popupContent.append(selectWithModels);
    selectWithModels.addEventListener('change', (e) => {
        models.find(item => {
            if (item.name === e.target.value && item.requirements.includes("endpoint")) {
                selectWithModels.after(elements.createInput("Конечная точка", "", {id: "endPoint"}));
            } else if (item.name === e.target.value && !item.requirements.includes("endpoint")) {
                const endPoint = document.getElementById("endPoint");
                if (endPoint) {
                    endPoint.previousSibling.remove();
                    endPoint.remove();
                }
            }
        })
    });
    popupContent.append(elements.createFormButton("Создать", {id: "createDevicePopup"}));
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
        const roomWeight = +document.getElementById("roomWeight").value;
        const roomLength = +document.getElementById("roomLength").value;
        const roomHeight = +document.getElementById("roomHeight").value;
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
        await makeRequest("http://localhost:80/rooms", "POST", room)
        popupFunctions.closePopup(e);
        location.reload();
    }
    if (e.target && e.target.id === 'createDevicePopup') {
        const deviceName = document.getElementById("deviceName").value;
        const macAddress = document.getElementById("macAddress").value;
        const deviceModel = document.getElementById("deviceModel").value;
        const device = {
            "name": deviceName,
            "deviceId": macAddress,
            "model": deviceModel,
        }
        console.log(device);
        await makeRequest("http://localhost:80/devices", "POST", device);
        popupFunctions.closePopup(e);
        location.reload();
    }
});
selectDeviceFilter.addEventListener('change', async (e) => {
    const type = e.target.value;
    if (type === "") {

        location.href = `http://localhost:80/`;
        return;
    }
    location.href = `http://localhost:80/?filterType=${type}`;
});


const rooms = document.getElementsByClassName("room");
for (const room of rooms) {
    room.onclick = () => {
        location.href = `/rooms/${room.id}`;
    }
}

function makeRequest(url, method, object) {
    const result = fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(object)
    });
    return result;
}