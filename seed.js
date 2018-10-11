var mongoose = require("mongoose");
var GPS   = require("./models/gps");
var Accelerometer   = require("./models/accelerometer");
var Gyro   = require("./models/gyro");
var Blackbox   = require("./models/blackbox");
var User   = require("./models/user");

//admin@gmail.com
//root
function seedDB() {
    var newUser = new User({role:"admin"});
    newUser.email = "admin@gmail.com";
     User.register(newUser,"root", function(err, user) {
    if(err){
      console.log(err);
    } else {
        console.log(user);
    }
  });
}


// function seedDB() {
//     User.remove({}, function(err) {
//         if (err) {
            
//         } else {
//             User.create({username: "DEV_1"}, function(err, data) {
//                  if (err) {
                    
//                 } else {
//                     console.log(data);
//                       Blackbox.remove({}, function(err) {
//                         if (err) {
                            
//                         } else {
//                             Blackbox.create({pi_key: "DEV_PI_1"}, function(err,data) {
//                                 if (err) {
                                    
//                                 } else {
//                                     console.log(data);
//                                 }
//                             });
//                             }
//                     } );
//                 }
//             });
//             }
//     } )
    
 
    
// }

module.exports = seedDB;