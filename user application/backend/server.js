const express = require("express");
const app = express();
const hbs = require("hbs");
const jsonParser = express.json();
const entities = require("./entities");
const mainController = require("./controllers/mainController");
const roomController = require("./controllers/roomController");
const scriptsController = require("./controllers/scriptsController");
const path = require("path");

app.use(jsonParser);
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));
hbs.registerPartials(path.join(__dirname, '..', 'frontend', 'views', 'partials'));
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));

app.get("/", mainController.index);
app.get("/rooms/:roomId", roomController.index);
app.post("/rooms", roomController.storeRoom);
app.post("/devices", mainController.storeDevice);
app.get("/scripts", scriptsController.index);
app.get("/scripts/create", scriptsController.create);
app.post("/subscription/indication", (req, res) => {
    console.log("Hello");
});
app.get("/models", (req, res) => res.json(entities.models));
app.listen(80);