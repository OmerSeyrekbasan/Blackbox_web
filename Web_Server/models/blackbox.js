var mongoose = require("mongoose"); 
//SCHEMA

var blackboxSchema = new mongoose.Schema({
        macAddress: String
});

module.exports = mongoose.model("Blackbox", blackboxSchema);