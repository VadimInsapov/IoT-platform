import * as elements from "../elementsForPopup.js";
import * as popupFunctions from "../popupFunctions.js";
import * as handlers from "./handlersForMakingPopup.js";
import {handleCreateDevicePopup, handleCreateRoomPopup} from "./handlersForMakingPopup.js";
import {handleCreateDevice, handleCreateRoom} from "./handlersForRequestsInsidePopup.js";
import {makeRequest} from "./makeRequest.js";
import {handleFilteringDevices} from "./handlerForSelect.js";

const buttonCreateDevicePopup = document.getElementById("createPopupDevice");
const buttonCreateRoomPopup = document.getElementById("createPopupRoom");
const popupCloseIcon = document.getElementById("close-popup");
const selectDeviceFilter = document.getElementById("deviceFilter");

popupCloseIcon.addEventListener("click", (e) => {
    popupFunctions.closePopup(e)
});
buttonCreateDevicePopup.addEventListener("click", handleCreateDevicePopup);
buttonCreateRoomPopup.addEventListener("click", handleCreateRoomPopup);
selectDeviceFilter.addEventListener('change', handleFilteringDevices);

document.addEventListener("click", async (e) => {
    if (!e.target) return;
    const idElement = e.target.id;
    if (idElement === "createRoom") handleCreateRoom(e);
    if (idElement === "createDevice") handleCreateDevice(e);
});


const rooms = document.getElementsByClassName("room");
for (const room of rooms) {
    room.onclick = () => {
        location.href = `/rooms/${room.id}`;
    }
    const buttonDeleteRoom = room.getElementsByClassName("room__button-delete")[0];
    buttonDeleteRoom.onclick = async (event) => {
        event.stopPropagation();
        console.log(`http://localhost:80/rooms/${room.id}`);
        await makeRequest(`http://localhost:80/rooms/${room.id}`, "DELETE");
        location.reload();
    }
}
const devices = document.getElementsByClassName("device");
for (const device of devices) {
    const buttonDeleteDevice = device.getElementsByClassName("device__button-delete")[0];
    buttonDeleteDevice.onclick = async () => {
        console.log(`http://localhost:80/devices/${device.id}`);
        await makeRequest(`http://localhost:80/devices/${device.id}`, "DELETE");
        location.reload();
    }
}

const commands = ["on", "off", "ring", "open", "close", "lock", "unlock"];
commands.map(command => {
    const buttonsOfCommand = document.getElementsByClassName(command);
    for (const buttonOfCommand of buttonsOfCommand) {
        buttonOfCommand.onclick = makeUpdatingCommand(buttonOfCommand, command);
    }
})

const socket = io();
socket.on("indication", function (message) {
    console.log(message)
    const device = document.getElementById(message["_id"]);
    if (device.getElementsByClassName("command")) {
        const buttonsCommand = device.getElementsByClassName("command")
        while (buttonsCommand[0]) {
            const buttonCommandWithADiv = buttonsCommand[0].parentNode
            buttonCommandWithADiv.parentNode.removeChild(buttonCommandWithADiv);
        }
    }
    delete message["_id"];
    for (const nameAttributeOrCommand in message) {
        const valueAttributeOrCommand = message[nameAttributeOrCommand];
        if (valueAttributeOrCommand.type === "command") {
            const div = document.createElement('div');
            div.className = "text-center";
            const button = document.createElement('button');
            button.className = `device__button-command ${nameAttributeOrCommand} command w-100 btn btn-sm btn-dark`;
            button.type = `button`;
            button.innerHTML = valueAttributeOrCommand.value;
            const buttonDeleteDevice = device.getElementsByClassName("device__button-delete")[0].parentNode;
            button.onclick = makeUpdatingCommand(button, nameAttributeOrCommand);
            div.append(button);
            console.log(div)
            buttonDeleteDevice.before(div);
        } else {
            const divAttribute = device.getElementsByClassName(nameAttributeOrCommand)[0];
            divAttribute.innerHTML = valueAttributeOrCommand.value;
        }
    }
});

function makeUpdatingCommand(button, command) {
    return async () => {
        const object = {
            id: button.closest(".device").id,
            command: command,
        }
        console.log(object);
        await makeRequest(`http://localhost:80/devices/update`, "POST", object);
        // location.reload();
    }
}
