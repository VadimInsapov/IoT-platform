const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const deviceScheme = new Schema({
    _id: String,
}, {strict: false});
module.exports = deviceScheme;
