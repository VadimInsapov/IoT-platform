import * as elements from "./elementsForPopup.js";
import * as popupFunctions from "./popupFunctions.js";

const buttonAddCondition = document.getElementById("addCondition");
const buttonAddCommand = document.getElementById("addCommand");
const buttonTimeCondition = document.getElementById("timeCondition");

const script = {
    conditions: [],
    handlers: [],
}
buttonAddCondition.addEventListener("click", (e) => {
    const popupContent = popupFunctions.openPopup();
    popupContent.append(elements.createFormTitle("Условие"));
    popupContent.append(elements.createFormButton("Время", {classNames: ['mb-3'], id: "timeCondition"}));
    popupContent.append(elements.createFormButton("Данные устройства", {id: "deviceCondition"}));
});

document.addEventListener("click", async (e) => {
    if (e.target && e.target.id == 'timeCondition') {
        popupFunctions.closePopup(e);
        const popupContent = popupFunctions.openPopup();
        popupContent.append(elements.createFormTitle("Условие: время"));
        popupContent.append(elements.createInput("", "", {type: "time", id: "valueTimeCondition"}));
        popupContent.append(elements.createFormButton("Добавить", {id: "addTimeCondition"}));
    }
    if (e.target && e.target.id == 'deviceCondition') {
        popupFunctions.closePopup(e);
        const popupContent = popupFunctions.openPopup();
        popupContent.append(elements.createFormTitle("Условие: данные устройства"));
        popupContent.append(elements.createFormButton("Выбрать по типу устройств", {
            classNames: ['mb-3'],
            id: "typeCondition"
        }));
        popupContent.append(elements.createFormButton("Выбрать определённое устройство", {id: "defDeviceCondition"}));
    }
    if (e.target && e.target.id == 'typeCondition') {
        popupFunctions.closePopup(e);
        const popupContent = popupFunctions.openPopup();
        popupContent.append(elements.createFormTitle("Условие"));
        popupContent.append(elements.createSelect(
            "Выбрать тип устройства",
            [{value: "broker:2:0", text: "устройство 1"}, {value: "broker:3:0", text: "устройство 3"}],
            {id: "type"}));
        popupContent.append(elements.createSelect(
            "Выбрать данные",
            [{value: "temperature", text: "Температура"}, {value: "humidity", text: "Влажность"}],
            {id: "attribute"}
        ));
        popupContent.append(elements.createSelect("Задать условие", ['больше', 'меньше', 'равно'], {id: "condition"}));
        popupContent.append(elements.createInput("", "0", {type: "number"}, {id: "conditionValue"}));
        popupContent.append(elements.createFormButton("Добавить", {id: "addTypeCondition"}));
    }
    if (e.target && e.target.id == 'defDeviceCondition') {
        popupFunctions.closePopup(e);
        const popupContent = popupFunctions.openPopup();
        popupContent.append(elements.createFormTitle("Условие"));
        popupContent.append(elements.createSelect("Выбрать устройство", ['1', '2', '3'], {id: "device"}));
        popupContent.append(elements.createSelect(
            "Выбрать данные",
            [{value: "temperature", text: "Температура"}, {value: "humidity", text: "Влажность"}],
            {id: "attribute"}
        ));
        popupContent.append(elements.createSelect("Задать условие", ['больше', 'меньше', 'равно'], {id: "condition"}));
        popupContent.append(elements.createInput("", "0", {type: "number"}, {id: "conditionValue"}));
        popupContent.append(elements.createFormButton("Добавить", {id: "addDefDeviceCondition"}));
    }
    if (e.target && e.target.id == 'addTimeCondition') {
        const time = document.getElementById("valueTimeCondition").value;
        if (!time) return;
        const [hour, minute] = time.split(":");
        script.conditions.push({
            type: "time",
            hour: hour,
            minute: minute
        });
        console.log(script);
        popupFunctions.closePopup(e);
    }
    if (e.target && e.target.id == 'addTypeCondition') {
        // try {
        //     const result = await fetch('http://localhost:4041/devices?form=short');
        //     console.log(result);
        // } catch (error) {
        //     console.error(error);
        // }
        const deviceType = document.getElementById("type").value;
        const attribute = document.getElementById("attribute").value;
        // const condition = document.getElementById("condition").value;
        // const conditionValue = document.getElementById("conditionValue").value;
        console.log(deviceType);
        console.log(attribute);


        popupFunctions.closePopup(e);
    }
    if (e.target && e.target.id == 'addDefDeviceCondition') {
        popupFunctions.closePopup(e);
    }

});
const popupCloseIcon = document.getElementById("close-popup");
popupCloseIcon.addEventListener("click", (e) => {
    popupFunctions.closePopup(e)
});