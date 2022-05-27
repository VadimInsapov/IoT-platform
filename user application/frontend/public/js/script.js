import { makeRequest } from "./index/makeRequest.js";

const scripts = document.getElementsByClassName("script");
for (const script of scripts) {
    const buttonEditScript = script.getElementsByClassName("script__button-edit")[0]
    buttonEditScript.onclick = () => {
        location.href = `/scripts/edit/${script.id}`;
    }
    const buttonDeleteScript = script.getElementsByClassName("script__button-delete")[0];
    buttonDeleteScript.onclick = async (event) => {
        event.stopPropagation();
        await makeRequest(`http://localhost:80/scripts/${script.id}`, "DELETE");
        location.reload();
    }
}
