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

var connections = [];
var users = [];
// BROADCAST TO BROWSER
router.ws("/:id/getAcc", function(ws, res) {
  var found = false;
  var i = 0;
  console.log("Connected Browser2!");
  var user=ws.upgradeReq.url.substring(ws.upgradeReq.url.indexOf("ws/")+2,ws.upgradeReq.url.indexOf("/getAcc"));
  // console.log(connections);
  console.log(user);
  console.log(users[0]);
  while (i < users.length && !found) {
    if (users[i] === user) {
      found = true;
    } else i++;
  }
  console.log(found);
  if (!found) {
    console.log("ERROROROROROROR!");
  } else {
    var wso = connections[i];
  }
  
  // console.log(router);
  wso.on('message', function(msg) {
    // console.log("burdayım lo");
    var json_msg = JSON.parse(msg)
    console.log(json_msg.accelerometer);
    if (json_msg.gyro && json_msg.accelerometer ) {
  } else 
      console.log(msg);
      ws.send(JSON.stringify(json_msg));
  });
  
  ws.on('close',function (){
    console.log("bye");
  }); 
});


//function to send gps data
function send_gps(ws) {
  
}
//function to send gyro data
function send_gyro(ws) {
  // body...
}
//function to send acc data
function send_acc(ws, user) {
  Accelerometer.find({user:user},null, {sort: {timeSent: -1}} ,function(err, data) {
      if (err) {
        console.log(err);
      } else {
        var msg ='{ "valx":' +data[0].accelerometer.xAxis +', "type":"type3",';
        msg += '"valy":' + data[0].accelerometer.yAxis + ',';
        msg += '"valz":' + data[0].accelerometer.zAxis + '}';
        console.log("DATA=1",data[0].accelerometer.xAxis);
      
        // console.log(msg);
        ws.send(msg);
      }
    });
}








function create_gyro(err, newData, json_msg) {
  if (err) {
    console.log("Error =", err);
  } else {
    extract_gyro(json_msg, newData);
  }
}


function create_acc(err, newData, json_msg) {
  if (err) {
    console.log("Error =", err);
  } else {
    extract_acc(json_msg, newData);
  }
}


function create_gps(err, newData, json_msg) {
  if (err) {
    console.log("Error =", err);
  } else {
    extract_gps(json_msg, newData);
  }
}

//check for gyro and gps datas indivually and then save to database
router.ws('/:id', function(ws, req) {
  var user=ws.upgradeReq.url.substring(ws.upgradeReq.url.indexOf("/")+1,ws.upgradeReq.url.lastIndexOf("/"));
  console.log("Connected PI!");
  users.push(user);
  console.log("Connected PI!");
  connections.push(ws);
  console.log("Connected PI!");
  
  var json_msg;
  var gps_count = 0;
  var acc_count = 0;
  var gyro_count = 0;
  ws.on('message', function(msg) {
      json_msg = JSON.parse(msg);
      if (json_msg.gyro && json_msg.accelerometer ) {
        gyro_count++;
        Gyro.create({gyro: json_msg.gyro},(err,newData) =>create_gyro(err, newData, json_msg));
      } else if(json_msg.accelerometer) {
        acc_count++;
          Accelerometer.create({accelerometer: json_msg.accelerometer},(err,newData) =>create_acc(err, newData, json_msg));
      } else if (json_msg.gps) {
        gps_count++;
          Gps.create({gps: json_msg.gps},(err,newData) =>create_gps(err, newData, json_msg));
      }
  });
  ws.on('close', function() {
    console.log ("Goodbye, Take care!" + "Number of GPS Messages :" + gps_count + "Number of ACC Messages :" + acc_count + "Number of gyro Messages :" + gyro_count);
  })
});







function extract_gyro(msg, newGyro) {
  newGyro.accelerometer = msg.accelerometer;
  newGyro.timeReceived = Date.now();
  newGyro.timeSent = msg.timeSent;
  
  //Need to find user id to be able to associate to models
  User.find({ username:msg.user}, (err,user ) =>{
      if(err) {
        console.log(err);
      } else {
        newGyro.user = user[0]._id;
        //Need to find blackbox id to be able to associate to models
        Blackbox.find({pi_key:msg.pi_no}, (err,blackbox) => {
          if (err) {
            console.log(err);
          }    else {
            // console.log(blackbox[0]._id);
            newGyro.pi_no = blackbox[0]._id;
            // console.log(newGyro);
            newGyro.save();
          }
       });
      }
  });
}

function extract_gps(msg, newGps) {
  newGps.timeReceived = Date.now();
  newGps.timeSent = msg.timeSent;
  
  //Need to find user id to be able to associate to models
  User.find({ username:msg.user}, (err,user ) =>{
      if(err) {
        console.log(err);
      } else {
        newGps.user = user[0]._id;
        //Need to find blackbox id to be able to associate to models
        Blackbox.find({pi_key:msg.pi_no}, (err,blackbox) => {
          if (err) {
            console.log(err);
          }    else {
            // console.log(blackbox[0]._id);
            newGps.pi_no = blackbox[0]._id;
            newGps.save();
          }
       });
      }
  });
}

function extract_acc(msg, newAcc) {
  newAcc.timeReceived = Date.now();
  newAcc.timeSent = msg.timeSent;
  
  //Need to find user id to be able to associate to models
  User.find({ username:msg.user}, (err,user ) =>{
      if(err) {
        console.log(err);
      } else {
        newAcc.user = user[0]._id;
        //Need to find blackbox id to be able to associate to models
        Blackbox.find({pi_key:msg.pi_no}, (err,blackbox) => {
          if (err) {
            console.log(err);
          }    else {
            // console.log(blackbox[0]._id);
            newAcc.pi_no = blackbox[0]._id;
            newAcc.save();
          }
       });
      }
  });
}

module.exports = router;