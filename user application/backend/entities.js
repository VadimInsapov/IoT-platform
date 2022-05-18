exports.models = [
    {
        name: "SThM",
        requirements: [],
    },
    {
        name: "SThH",
        requirements: [],
    },
    {
        name: "SMtM",
        requirements: [],
    },
    {
        name: "SMtH",
        requirements: [],
    },
    {
        name: "SBellM",
        requirements: [],
    },
    {
        name: "SBellH",
        requirements: ["endpoint"],
    },
    {
        name: "SLampM",
        requirements: [],
    },
    {
        name: "SLampH",
        requirements: ["endpoint"],
    },
    {
        name: "SDoorM",
        requirements: [],
    },
    {
        name: "SDoorH",
        requirements: ["endpoint"],
    },
];

exports.deviceTypes = {
    "Thermometer": {
        text: "Термометр",
        attributes: [
            ["humidity", "Влажность"],
            ["temperature", "Температура"],
        ],
    },
    "Motion": {
        text: "Датчик движения",
        attributes: [
            ["count", "Присутствие"],
        ],
    },
    "Bell": {
        text: "Звонок",
        attributes: {
            ring: "Позвонить",
        },
    },
    "Lamp": {
        text: "Лампа",
        attributes: {
            status: "Состояние",
            value: {
                "on": "Включено",
                "off": "Выключено",
            }
        },
    },
    "Door": {
        text: "Дверь",
        attributes: {
            status: "Состояние",
            value: {
                "open": "Открыто",
                "close": "Закрыто",
                "unlock": "Разблакировано",
                "lock": "Заблокировано",
            }
        },
    },
}