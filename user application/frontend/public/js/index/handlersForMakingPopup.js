import * as elements from "../elementsForPopup.js";
import * as popupFunctions from "../popupFunctions.js";

const responseForModels = await fetch("http://localhost:80/models");
const models = await responseForModels.json();

export async function handleCreateDevicePopup(e) {
    const popupContent = popupFunctions.openPopup();
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
                selectWithModels.after(elements.createInput("Конечная точка", "", {id: "endpoint"}));
            } else if (item.name === e.target.value && !item.requirements.includes("endpoint")) {
                const endPoint = document.getElementById("endPoint");
                if (endPoint) {
                    endPoint.previousSibling.remove();
                    endPoint.remove();
                }
            }
        })

    });
    popupContent.append(elements.createFormButton("Создать", {id: "createDevice"}));
}

export async function handleCreateRoomPopup(e) {
    const popupContent = popupFunctions.openPopup();
    popupContent.append(elements.createFormTitle("Создать комнату"));
    popupContent.append(elements.createInput("Название", "", {id: "roomName"}));
    popupContent.append(elements.createInput("Описание", "", {id: "roomDescription"}))
    popupContent.append(elements.createSelect(
        "Тип комнаты",
        [
            {value: "Ванна", text: "Ванна"},
            {value: "Спальня", text: "Спальня"},
            {value: "Гостиная", text: "Гостиная"},
            {value: "Детская", text: "Детская"},
            {value: "Кухня", text: "Кухня"},
            {value: "Прихожая", text: "Прихожая"},
        ],
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
    popupContent.append(elements.createFormButton("Создать", {id: "createRoom"}));
}