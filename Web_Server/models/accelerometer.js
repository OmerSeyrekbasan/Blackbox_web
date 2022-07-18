var mongoose = require("mongoose"); 
//SCHEMA

var accelerometerSchema = new mongoose.Schema({
        
    x: Number,
    y: Number,
    z: Number,
    //
    // timeReceived: Date,
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


module.exports = mongoose.model("Accelerometer", accelerometerSchema);