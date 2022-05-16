const express = require("express");
const app = express();
const hbs = require("hbs");
const mainController = require("./controllers/mainController");
const roomController = require("./controllers/roomController");
const scriptsController = require("./controllers/scriptsController");
const path = require("path");
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));
hbs.registerPartials(path.join(__dirname, '..', 'frontend', 'views', 'partials'));
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));

app.get("/", mainController.index);
app.get("/rooms/:room", roomController.index);
app.get("/scripts", scriptsController.index);
app.get("/scripts/create", scriptsController.create);
app.listen(80);