import * as elements from "./elementsForPopup.js";
import * as popupFunctions from "./popupFunctions.js";
import { makeRequest } from "./index/makeRequest.js";

const scriptId = window.location.pathname.split("/")[3];
let sub = {}
const buttonAddCondition = document.getElementById("addCondition");
const buttonAddCommand = document.getElementById("addCommand");
const buttonUpdateSub = document.getElementById("updateSub")


const types = new Map([
    ['Thermometer', 'Термометры'],
    ['Motion', 'Датчики движения'],
    ['Door', 'Двери'],
    ['Lamp', 'Лампы'],
    ['Bell', 'Звонки']
])

const attributes = new Map([
    ["humidity", "Влажность"], ["temperature", "Температура"],
    ["count", "Количество"],
    ["status", "Состояние"]
])

const commands = new Map([
    ["open", "Открыть"], ["close", "Закрыть"], ["lock", "Заблокировать"], ["unlock", "Разблокировать"],
    ["on", "Включить"], ["off", "Выключить"],
    ["ring", "Позвонить"]
])

const script = {
    conditions: [],
    handlers: [],
}
window.onload = async function () {
    sub = await fetch(`http://127.0.0.1:5500/iot/entities/${scriptId}`).then(response => {
        return response.json()
    })
    console.log(sub)
    document.getElementById("name_input").value = sub["description"]
    if (sub.hasOwnProperty("time")) createTime(sub["time"])
    createConditions(sub.subject)
    createHandlers(sub.handler)
    console.log(script)
}

function createTime(time) {
    let condition = {}
    condition["type"] = "time"
    condition["hour"] = time.split(":")[0]
    condition["minute"] = time.split(":")[1]
    condition["id"] = `condition ${condition["hour"]} ${condition["minute"]}`
    script.conditions.push(condition)
    drawTimeCondition(condition)
}

async function createConditions(subjects) {
    for (let subject of subjects) {
        let condition = {}
        condition["type"] = "subject"
        if (subject["idPattern"] == ".*") {
            condition["idPattern"] = subject["idPattern"]
            condition["typePattern"] = subject["typePattern"]
            condition["nameSubject"] = types.get(subject["typePattern"])
        }
        else {
            condition["idPattern"] = subject["idPattern"]
            condition["typePattern"] = subject["typePattern"]
            let a = await fetch(`http://127.0.0.1:5500/iot/entities/${subject["idPattern"]}/attrs/name`).then(response => {
                return response.json()
            })
            condition["nameSubject"] = a["value"]
        }
        condition["attrs"] = subject["attrs"]
        condition["nameAttrs"] = attributes.get(subject["attrs"][0])
        if (subject.hasOwnProperty("condition"))
            condition["condition"] = subject["condition"].replace(subject["attrs"][0], "")
        condition["id"] = `condition ${condition["nameSubject"]} ${condition["nameAttrs"]} ${condition.hasOwnProperty("condition") ? condition["condition"] : ""}`
        script.conditions.push(condition)
        drawCondition(condition)
    }
}

async function createHandlers(subjects) {
    for (let subject of subjects) {
        let handler = {}
        if (subject["id"].split(":")[2] == ".*") {
            handler["idPattern"] = subject["id"]
            handler["nameHandler"] = types.get(subject["id"].split(":")[1])
        }
        else {
            handler["idPattern"] = subject["idPattern"]
            let a = await fetch(`http://127.0.0.1:5500/iot/entities/${subject["idPattern"]}/attrs/name`).then(response => {
                return response.json()
            })
            handler["nameHandler"] = a["value"]
        }
        handler["command"] = subject["command"]
        handler["nameCommand"] = commands.get(subject["command"])
        handler["id"] = `handler ${handler["nameHandler"]} ${handler["nameCommand"]}`
        script.handlers.push(handler)
        drawHandler(handler)
    }
}

buttonAddCondition.addEventListener("click", (e) => {
    const popupContent = popupFunctions.openPopup();
    popupContent.append(elements.createFormTitle("Условие"));
    popupContent.append(elements.createFormButton("Время", { classNames: ['mb-3'], id: "timeCondition" }));
    popupContent.append(elements.createFormButton("Данные устройства", { id: "deviceCondition" }));
});

buttonAddCommand.addEventListener("click", (e) => {
    const popupContent = popupFunctions.openPopup();
    popupContent.append(elements.createFormTitle("Исполнитель"));
    popupContent.append(elements.createFormButton("Выбрать по типу устройств", {
        classNames: ['mb-3'],
        id: "typeHandler"
    }));
    popupContent.append(elements.createFormButton("Выбрать определённое устройство", { id: "deviceHandler" }));
});

document.addEventListener("click", async (e) => {
    if (e.target && e.target.id == 'timeCondition') {
        popupFunctions.closePopup(e);
        const popupContent = popupFunctions.openPopup();
        popupContent.append(elements.createFormTitle("Условие: время"));
        popupContent.append(elements.createInput("", "", { type: "time", id: "valueTimeCondition" }));
        popupContent.append(elements.createFormButton("Добавить", { id: "addTimeCondition" }));
    }
    if (e.target && e.target.id == 'deviceCondition') {
        popupFunctions.closePopup(e);
        const popupContent = popupFunctions.openPopup();
        popupContent.append(elements.createFormTitle("Условие: данные устройства"));
        popupContent.append(elements.createFormButton("Выбрать по типу устройств", {
            classNames: ['mb-3'],
            id: "typeCondition"
        }));
        popupContent.append(elements.createFormButton("Выбрать определённое устройство", { id: "defDeviceCondition" }));
    }
    if (e.target && e.target.id == 'typeCondition') {
        popupFunctions.closePopup(e);
        const popupContent = popupFunctions.openPopup();
        popupContent.append(elements.createFormTitle("Условие"));
        popupContent.append(elements.createSelect(
            "Выбрать тип устройства",
            [{ value: "Thermometer", text: "Термометры" }, { value: "Motion", text: "Датчики движения" }, { value: "Door", text: "Двери" }, { value: "Lamp", text: "Лампы" }],
            { id: "type" }));
    }
    if (e.target && e.target.id == 'defDeviceCondition') {
        popupFunctions.closePopup(e);
        const popupContent = popupFunctions.openPopup();
        popupContent.append(elements.createFormTitle("Условие"));
        const devices = await fetch(`http://127.0.0.1:5500/iot/entities?type=Thermometer,Motion,Door,Lamp`).then(response => {
            return response.json()
        })
        let selectDevices = []
        for (let device of devices) {
            selectDevices.push({ value: `${device._id}`, text: `${device.name.value}` })
        }
        popupContent.append(elements.createSelect("Выбрать устройство", selectDevices, { id: "device" }));
    }
    if (e.target && e.target.id == 'addTimeCondition') {
        const time = document.getElementById("valueTimeCondition").value;
        if (!time) return;
        const [hour, minute] = time.split(":");
        let cond = {
            type: "time",
            hour: hour,
            minute: minute
        }
        cond["id"] = `condition ${cond["hour"]} ${cond["minute"]}`
        script.conditions.push(cond)
        console.log(script);
        popupFunctions.closePopup(e);
        drawTimeCondition(cond)
    }
    if (e.target && e.target.id == 'addTypeCondition') {
        let cond = {}
        cond["type"] = "subject"
        if (document.getElementById("type")) {
            cond["idPattern"] = ".*"
            cond["typePattern"] = document.getElementById("type").value
            cond["nameSubject"] = document.getElementById("type").options[document.getElementById("type").selectedIndex].text
        }
        else {
            cond["idPattern"] = document.getElementById("device").value
            cond["typePattern"] = document.getElementById("device").value.split(':')[1]
            cond["nameSubject"] = document.getElementById("device").options[document.getElementById("device").selectedIndex].text
        }
        cond["attrs"] = [document.getElementById("attribute").value]
        cond["nameAttrs"] = document.getElementById("attribute").options[document.getElementById("attribute").selectedIndex].text
        if (document.getElementById("conditionValue")) {
            let cond_string = ""
            if (document.getElementById("condition"))
                cond_string += document.getElementById("condition").value
            else cond_string += "="
            cond_string += document.getElementById("conditionValue").value;
            cond["condition"] = cond_string
        }
        cond["id"] = `condition ${cond["nameSubject"]} ${cond["nameAttrs"]} ${cond.hasOwnProperty["condition"] ? cond["condition"] : ""}`
        script.conditions.push(cond)
        console.log(script);
        popupFunctions.closePopup(e);
        drawCondition(cond)
    }
    if (e.target && e.target.id == 'typeHandler') {
        popupFunctions.closePopup(e);
        const popupContent = popupFunctions.openPopup();
        popupContent.append(elements.createFormTitle("Исполнитель"));
        popupContent.append(elements.createSelect(
            "Выбрать тип устройства",
            [{ value: "Door", text: "Двери" }, { value: "Lamp", text: "Лампы" }, { value: "Bell", text: "Звонки" }],
            { id: "handlerType" }));
    }
    if (e.target && e.target.id == 'deviceHandler') {
        popupFunctions.closePopup(e);
        const popupContent = popupFunctions.openPopup();
        popupContent.append(elements.createFormTitle("Исполнитель"));
        const devices = await fetch(`http://127.0.0.1:5500/iot/entities?type=Door,Lamp,Bell`).then(response => {
            return response.json()
        })
        let selectDevices = []
        for (let device of devices) {
            selectDevices.push({ value: `${device._id}`, text: `${device.name.value}` })
        }
        popupContent.append(elements.createSelect("Выбрать устройство", selectDevices, { id: "defDeviceHandler" }));
    }
    if (e.target && e.target.id == 'addHandler') {
        let hand = {}
        if (document.getElementById("handlerType")) {
            hand["idPattern"] = `broker:${document.getElementById("handlerType").value}:.*`
            hand["nameHandler"] = document.getElementById("handlerType").options[document.getElementById("handlerType").selectedIndex].text
        }
        else {
            hand["idPattern"] = document.getElementById("defDeviceHandler").value
            hand["nameHandler"] = document.getElementById("defDeviceHandler").options[document.getElementById("defDeviceHandler").selectedIndex].text
        }
        hand["command"] = document.getElementById("command").value
        hand["nameCommand"] = document.getElementById("command").options[document.getElementById("command").selectedIndex].text
        hand["id"] = `handler ${hand["nameHandler"]} ${hand["nameCommand"]}`
        script.handlers.push(hand)
        console.log(script);
        popupFunctions.closePopup(e);
        drawHandler(hand)
    }
});

const popupCloseIcon = document.getElementById("close-popup");
popupCloseIcon.addEventListener("click", (e) => {
    popupFunctions.closePopup(e)
});

buttonUpdateSub.onclick = async (event) => {
    event.stopPropagation();
    var subscription = {}
    subscription["description"] = document.getElementById("name_input").value
    subscription["subject"] = []
    subscription["handler"] = []
    for (let cond of script.conditions) {
        if (cond["type"] == "time") {
            subscription["time"] = `${cond["hour"]}:${cond["minute"]}`
        }
        else {
            let subject = {}
            subject["idPattern"] = cond["idPattern"]
            subject["typePattern"] = cond["typePattern"]
            subject["attrs"] = cond["attrs"]
            if (cond.hasOwnProperty("condition"))
                subject["condition"] = cond["attrs"][0] + cond["condition"]
            subscription["subject"].push(subject)
        }
    }
    for (let hand of script.handlers) {
        let handler = {}
        handler["id"] = hand["idPattern"]
        handler["command"] = hand["command"]
        subscription["handler"].push(handler)
    }
    await makeRequest(`http://localhost:80/scripts/edit/${scriptId}`, "PATCH", subscription);
    window.location.href = '/scripts'
}

function drawTimeCondition(time) {
    let conditionList = document.getElementById("conditionsList")
    let ul_condition = document.createElement("ul")
    ul_condition.className = "list-group list-group-horizontal"
    let li_condition_1 = document.createElement("li")
    li_condition_1.className = "list-group-item fs-4"
    li_condition_1.textContent = `Время:`
    let li_condition_2 = document.createElement("li")
    li_condition_2.className = "list-group-item fs-4"
    li_condition_2.textContent = `${time["hour"]}:${time["minute"]}`
    let button = document.createElement("button")
    button.className = "btn-close"
    button.id = time["id"]
    button.addEventListener("click", deleteCondition)
    ul_condition.appendChild(li_condition_1)
    ul_condition.appendChild(li_condition_2)
    ul_condition.appendChild(button)
    conditionList.appendChild(ul_condition)
}

function drawCondition(condition) {
    let conditionList = document.getElementById("conditionsList")
    let ul_condition = document.createElement("ul")
    ul_condition.className = "list-group list-group-horizontal"
    let li_condition_subject = document.createElement("li")
    li_condition_subject.className = "list-group-item fs-4"
    li_condition_subject.textContent = `${condition["nameSubject"]}`
    ul_condition.appendChild(li_condition_subject)
    let li_condition_attr = document.createElement("li")
    li_condition_attr.className = "list-group-item fs-4"
    li_condition_attr.textContent = `${condition["nameAttrs"]}`
    ul_condition.appendChild(li_condition_attr)
    if (condition.hasOwnProperty("condition")) {
        let li_condition = document.createElement("li")
        li_condition.className = "list-group-item fs-4"
        li_condition.textContent = `${condition["condition"]}`
        ul_condition.appendChild(li_condition)
    }
    let button = document.createElement("button")
    button.id = condition["id"]
    button.addEventListener("click", deleteCondition)
    button.className = "btn-close"
    ul_condition.appendChild(button)
    conditionList.appendChild(ul_condition)
}

const deleteCondition = (e) => {
    const button = e.target
    for (let cond of script.conditions) {
        if (Object.values(cond).includes(button.id)) {
            script.conditions.splice(script.conditions.indexOf(cond), 1)
            document.getElementById(button.id).parentElement.remove()
            console.log(script)
            return
        }
    }
}

function drawHandler(handler) {
    let handlersList = document.getElementById("handlersList")
    let ul_handler = document.createElement("ul")
    ul_handler.className = "list-group list-group-horizontal"
    let li_handler_name = document.createElement("li")
    li_handler_name.className = "list-group-item fs-4"
    li_handler_name.textContent = `${handler["nameHandler"]}`
    let li_handler_command = document.createElement("li")
    li_handler_command.className = "list-group-item fs-4"
    li_handler_command.textContent = `${handler["nameCommand"]}`
    ul_handler.appendChild(li_handler_name)
    ul_handler.appendChild(li_handler_command)
    let button = document.createElement("button")
    button.className = "btn-close"
    button.id = handler["id"]
    button.addEventListener("click", deleteHandler)
    ul_handler.appendChild(button)
    handlersList.appendChild(ul_handler)
}

const deleteHandler = (e) => {
    const button = e.target
    for (let hand of script.handlers) {
        if (Object.values(hand).includes(button.id)) {
            script.handlers.splice(script.handlers.indexOf(hand), 1)
            document.getElementById(button.id).parentElement.remove()
            console.log(script)
            return
        }
    }
}
