var mongoose = require("mongoose"); 
//SCHEMA

var gpsSchema = new mongoose.Schema({
        
    //longitude 
    lon: Number,
    //latitude
    lat: Number,
    //time received
    // tR: Date,
    //time sent
    tS: Date,
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    //blackbox
    bb: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blackbox"
        }
});

module.exports = mongoose.model("GPS", gpsSchema);