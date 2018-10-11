var mongoose = require("mongoose"); 
//SCHEMA

var ObdSchema = new mongoose.Schema({
    

    //engine load
    lo: String,
    //coolant temp
    cT: String,
    speed: String,
    rpm: String,
    //throttle pos
    tP: String,
    //oil Temp
    oT: String,
    //torque
    t: String,
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


module.exports = mongoose.model("Obd", ObdSchema);