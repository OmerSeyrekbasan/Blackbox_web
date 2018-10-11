var mongoose = require("mongoose");
//SCHEMA

var SettingsSchema = new mongoose.Schema({
    acc: Number,
    gps: Number,
    android: Number,
    obd: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});


module.exports = mongoose.model("Settings", SettingsSchema);