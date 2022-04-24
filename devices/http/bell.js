const express = require("express");
const app = express();
const MACAddress = "mac:mqtt:bell002"
const jsonParser = express.json();
app.use(jsonParser);
console.log("HTTP звонок слушает трафик по адресу");
console.log("http://127.0.0.1:3010/");
console.log("MAC-address: "+ MACAddress);
app.post(`/${MACAddress}/commands`, function(request, response){
    console.log(request.body);
});
app.listen(3010);
