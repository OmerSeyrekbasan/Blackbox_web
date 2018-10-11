var mongoose = require("mongoose"); 
//SCHEMA

var androidSchema = new mongoose.Schema({
        
    x: Number,
    y: Number,
    z: Number,
    // timeReceived: Date,
    tS: Date,
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    blackbox: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blackbox"
        }
    });


module.exports = mongoose.model("Android", androidSchema);