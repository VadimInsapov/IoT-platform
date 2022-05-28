const async = require('hbs/lib/async');
const fetch = require('node-fetch');
const iotPlatform = require("./iotPlatformFunctions");

exports.index = async function (request, response) {
    const subs = await fetch(`http://127.0.0.1:5500/iot/subscriptions`).then(response => {
        return response.json()
    })
    const scriptsByUser = subs.filter(sub => "description" in sub);
    console.log(subs);
    console.log(scriptsByUser);
    response.render("scripts.hbs", {
        subs: scriptsByUser
    });
};
exports.create = function (request, response) {
    response.render("scripts.create.hbs");
};

exports.deleteScript = async function (request, response) {
    try {
        const scriptId = request.params.scriptId;
        const a = await iotPlatform.deleteScriptById(scriptId);
        response.json({answer: "OK"});
    } catch (err) {
        if (err) console.log(err)
    }
}

exports.createScript = async function (request, response) {
    try {
        console.log(request.body);
        const script = request.body;
        const a = await iotPlatform.createScript(script);
        response.json({answer: "OK"});
    } catch (err) {
        if (err) console.log(err)
    }
}

exports.edit = async function (request, response) {
    response.render("scripts.edit.hbs");
};

exports.updateScript = async function (request, response) {
    try {
        const scriptId = request.params.scriptId;
        const script = request.body;
        const a = await iotPlatform.updateScript(scriptId, script);
        response.json({answer: "OK"});
    } catch (err) {
        if (err) console.log(err)
    }
} 
