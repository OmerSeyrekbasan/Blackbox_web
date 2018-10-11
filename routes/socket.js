var express = require("express");
var router = express.Router();
var router = express.Router({mergeParams:true});
var Gps= require("../models/gps");
var Gyro = require("../models/gyro");
var Accelerometer = require("../models/accelerometer");
var Obd = require("../models/obd");
var Blackbox = require("../models/blackbox");
var User = require("../models/user");
var BSON = require("bson");
var Android = require("../models/android");
var Watch = require("../models/watch");

var connections = [];
var users = [];

//verileri tipine göre kontrol et ve veritabanına yaz
router.ws('/:id', function(ws, req) {
  var user=ws.upgradeReq.url.substring(ws.upgradeReq.url.indexOf("/")+1,ws.upgradeReq.url.lastIndexOf("/"));
  var newSocket;
  
  console.log("Connected PI!");
  users.push(user);
  console.log("Connected PI!");
  connections.push(ws);
  console.log("Connected PI!");
  
  router.ws("/:id/getAcc", function(wsnew, res) {
      // var userId = wsnew.upgradeReq.url.substring(ws.upgradeReq.url.indexOf("/")+1,ws.upgradeReq.url.lastIndexOf("/")+2);
      var userId = wsnew.upgradeReq.url.split("/")[1];
      console.log("Browser request");
      console.log(user);
  
      console.log("User Id = ", userId);
      if (user === userId) {
        newSocket = wsnew;
        console.log("Browser Mode Activated!");
      } else {
        
      }
      throw "790";
       
  });
  
  var json_msg;
  var gps_count = 0;
  var acc_count = 0;
  var gyro_count = 0;
  var androidCount = 0;
  var watchCount = 0;
  var count = [0,0,0,0,0,0];
  ws.on('message', function(msg) {
      // console.log("PI Mode Activated!");
      // console.log(newSocket);
      // console.log("Message = ", msg);
      // console.log(msg);
      
      try {
        json_msg = JSON.parse(msg);
      } catch (e) {
        console.log("Error Parsing JSON!");
        console.log("-----------------");
        console.log(msg);
        console.log("-----------------");
        json_msg = undefined;
      }
      if (json_msg) {
        if (newSocket) {
          try {
            newSocket.send(msg);
            console.log("Message Sent!");
          } catch (e) {
            newSocket = undefined;
          }
        }
        
        var type = json_msg.type;
        count[type] = count[type] +1;
        
        saveToDB(json_msg);
        
      }
        
      
  });
  ws.on('close', function() {
    console.log ("Goodbye, Take care!" + "Number of GPS Messages :" + count[0] + "Number of ACC Messages :" + count[2] + 
    "Number of gyro Messages :" + count[1] + "Number of Android Messages:" + count[4] + "Number of OBD messages :" + count[3]);
  })
});


//function to save coming messages to db
/*
type0 = gps
type1 = gyro
type2 = acc
type3 = obd
type4 = android
type5 = watch
*/
function saveToDB(msg) {
  switch(msg.type) {
    case 0:
      saveGPS(msg);
      break;
    case 1:
      saveGyro(msg);
      break;
    case 2:
      saveAcc(msg);
      break;
    case 3:
      saveOBD(msg);
      break;
    case 4:
      saveAndroid(msg);
      break;
    case 5:
      saveWatch(msg);
      break;
  }
}

//function for saving gps to database
function saveGPS(msg) {
  var newGPS = {
    lon: msg.lon,
    lat: msg.lat,
    // tR: Date.now(),
    tS: msg.tS,
  };
  User.findOne({macAddress: msg.user}, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      Blackbox.findOne({macAddress:msg.pi_no}, (err, blackbox) => {
        if (err) {
          console.log(err);
        } else {
          newGPS.user = user._id;
          newGPS.bb = blackbox._id; 
          Gps.create(newGPS, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
 
}

//function for saving gyro to database
function saveGyro(msg) {
  // console.log(msg);
  var newGyro = {
    x: msg.x,
    y: msg.y,
    z: msg.z,
    // timeReceived: Date.now(),
    tS: msg.tS
  }
  User.findOne({macAddress: msg.user}, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      Blackbox.findOne({macAddress:msg.pi_no}, (err, blackbox) => {
        if (err) {
          console.log(err);
        } else {
          newGyro.user = user._id;
          newGyro.bb = blackbox._id; 
          Gyro.create(newGyro, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
  
}

//function for saving acc to database
function saveAcc(msg) {
  // console.log(msg);
  var newAcc = {
    x: msg.x,
    y: msg.y,
    z: msg.z,
  
    // timeReceived: Date.now(),
    tS: msg.tS
  }
  User.findOne({macAddress:msg.user}, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      Blackbox.findOne({macAddress:msg.pi_no}, (err, blackbox) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(msg.user);
          // console.log(user);
          
          newAcc.user = user._id;
          newAcc.bb = blackbox._id; 
   
          Accelerometer.create(newAcc, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
  
}

//function for saving obd to database
function saveOBD(msg) {
  var newOBD = {
    
    speed: msg.speed,
    rpm: msg.rpm,
    
    // timeReceived: Date.now(),
    tS: msg.tS
  }
  User.findOne({macAddress: msg.user}, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      Blackbox.findOne({macAddress:msg.pi_no}, (err, blackbox) => {
        if (err) {
          console.log(err);
        } else {
          newOBD.user = user._id;
          newOBD.bb = blackbox; 
          Obd.create(newOBD, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
}

//function for saving android to database
function saveAndroid(msg) {
  var newAndroid = {
    x: msg.x,
    y: msg.y,
    z: msg.z,
    // timeReceived: Date.now(),
    tS: msg.tS
  }
  User.findOne({macAddress: msg.user}, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      Blackbox.findOne({macAddress:msg.pi_no}, (err, blackbox) => {
        if (err) {
          console.log(err);
        } else {
          newAndroid.user = user._id;
          newAndroid.blackbox = blackbox._id; 
          Android.create(newAndroid, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
}



//function for saving watch to database
function saveWatch(msg) {
  // console.log(msg);
  var newWatch = {
    hR: msg.heartRate,
    // timeReceived: Date.now(),
    tS: msg.timeSent,
  };
  User.findOne({macAddress: msg.user}, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      Blackbox.findOne({macAddress:msg.pi_no}, (err, blackbox) => {
        if (err) {
          console.log(err);
        } else {
          newWatch.user = user._id;
          newWatch.bb = blackbox._id; 
          Watch.create(newWatch, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
 
}



module.exports = router;