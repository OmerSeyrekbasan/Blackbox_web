var mongoose = require("mongoose"); 
var passportLocalMongoose = require("passport-local-mongoose");
require('mongoose-type-email');
//SCHEMA

var userSchema = new mongoose.Schema({
        password: String,
        name: String,
        surname: String,
        email: mongoose.SchemaTypes.Email,
        role: String,
        company: String,
        TC: { 
                type: Number, 
                min: 1000000000, 
                max: 99999999999 
                
        },
        macAddress: {
                type: String,
                uppercase:true
        }
        
        
});

userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

module.exports = mongoose.model("User", userSchema);