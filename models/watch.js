var mongoose = require("mongoose"); 
//SCHEMA

var watchSchema = new mongoose.Schema({
    //heartRate 
    hR: Number,
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


module.exports = mongoose.model("Watch", watchSchema);