export function createFormTitle(title) {
    const div = document.createElement('div');
    div.className = "device__title mt-3 mb-3 text-center fs-4";
    div.textContent = title;
    return div;
}

export function createFormButton(name, object = {}) {
    const {id = "", classNames = ""} = object;
    const div = document.createElement('div');
    div.className = "text-center";
    const button = document.createElement('button');
    if (id) button.id = id;
    button.className = "btn btn-primary btn-lg";
    if (classNames) button.className += ` ${classNames.join(' ')}`;
    button.textContent = name;
    div.append(button);
    return div;
}

export function createInput(name, value, object = {}) {
    const {extraName = "", type = "text", id = ""} = object;
    const div = document.createElement('div');
    div.className = "popup__selection input-group input-group-lg";
    if (name) {
        const span = createSpanInInput(name);
        div.append(span);
    }
    const input = document.createElement('input');
    input.type = type;
    if (type === "number") input.min = 0;
    input.className = "form-control";
    input.value = value;
    if (id) {
        input.id = id;
    }
    div.append(input);
    if (extraName) div.append(createSpanInInput(extraName));
    return div;
}

export function createSpanInInput(value) {
    const span = document.createElement('span');
    span.className = "input-group-text";
    span.textContent = value;
    return span;
}

export function createDiv(value) {
    const span = document.createElement('div');
    span.className = "text-center";
    span.textContent = value;
    return span;
}

export function createSelect(defaultText, array, object = {}) {
    const {id} = object;
    const select = document.createElement('select');
    select.className = "popup__selection form-select form-select-lg mb-3";
    const defaultOption = document.createElement("option");
    defaultOption.text = defaultText;
    select.add(defaultOption);
    if (id) {
        select.id = id;
    }
    for (const item of array) {
        const option = document.createElement("option");
        option.text = item.text;
        option.value = item.value;
        select.add(option);
    }
    return select;
}
