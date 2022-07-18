var mongoose = require("mongoose"); 
//SCHEMA

var subscriptionSchema = new mongoose.Schema({
        
    marka: String,
    model: String,
    plaka: String,
    renk: String,
    motor: String,
    sase: String,
    baslamaTarih: Date,
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    blackbox: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blackbox"
        }
    });


module.exports = mongoose.model("Subscription", subscriptionSchema);