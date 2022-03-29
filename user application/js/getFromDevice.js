const express = require("express");
const app = express();
const jsonParser = express.json();
app.post("/changes", jsonParser, function(req, res){
    console.log(req.body);
});
app.listen(80, function(){
    console.log("Сервер ожидает подключения...");
});