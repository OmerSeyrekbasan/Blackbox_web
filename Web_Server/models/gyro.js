var mongoose = require("mongoose"); 
//SCHEMA

var GyroSchema = new mongoose.Schema({
    //x Axis 
    //y Axis
    //z Axis
    x: Number,
    y: Number,
    z: Number,
    // timeReceived: Date,
    //timeSent
    tS: Date,
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    bb: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blackbox"
        }
    });


module.exports = mongoose.model("Gyro", GyroSchema);