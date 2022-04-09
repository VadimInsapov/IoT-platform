const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// установка схемы
const deviceScheme = new Schema({
    _id: String,
}, {strict: false});
module.exports = deviceScheme;