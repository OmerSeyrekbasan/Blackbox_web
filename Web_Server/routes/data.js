var express = require("express");
var router = express.Router({mergeParams:true});

var middleware = require("./middleware/index");

var GPS = require("../models/gps");
var Accelerometer = require("../models/accelerometer");
var Gyro = require("../models/gyro");
var Android = require("../models/android");
var OBD = require("../models/obd");
var Watch = require("../models/watch");
var User= require("../models/user");
var Blackbox= require("../models/blackbox");

router.use(function(req, res, next) {
   res.locals.currentUser = req.user; 
   next();
});

//sadece debug amaçlı
router.post("/gps", function(req, res) {
    req.body.forEach(function(a) {
        var b = JSON.parse(a);
        console.log(b);
        saveGPS(b);
    })
  
});
//sadece debug amaçlı
function saveGPS(msg) {
  // console.log(msg);
  var newGPS = {
    gps: {
      longitude: msg.gps.longitude,
      latitude: msg.gps.latitude
    },
    timeReceived: Date.now(),
    timeSent: msg.timeSent,
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
          newGPS.blackbox = blackbox._id; 
          GPS.create(newGPS, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
 
}


//GPS tarih seçimi sayfası
router.get("/gps_index",middleware.isLoggedIn, function (req, res) {
  res.render("user/data/gps_index");
});



//gps bilgilerini göstermek için gerekli olan route
router.get("/gps", middleware.isLoggedIn, function (req, res) {
  // console.log(req);
  console.log(req.query.start);
  GPS.find({ 
    tS: {
      '$gte': req.query.start,
      '$lt': req.query.end   }
   }).sort('tS').limit(500).exec((function (err, gps) {
    if (err) {
      console.log(err);
    } else {
      var data = [];
      // console.log(gps);
      gps.forEach(function (row) {
        console.log(row);
        var tmp = {
          longitude: row.lon,
          latitude: row.lat
        }
        data.push(tmp);
      });
      console.log(data);
      res.render("user/data/gps", { gps: data });
    }
  })
  )
});


//ivmeölçer ve bağlantılı sensörlerin tarih seçimi
router.get("/acc_index", middleware.isLoggedIn, function (req, res) {
  var wantedUser = req.params.id; 
  res.render("user/data/acc_index", {wantedUser: wantedUser});
});

//ivmeölçer ve bağlantılı sensörlerin bilgilerini göstermek için gerekli olan route
router.get("/acc", middleware.isLoggedIn, function (req, res) {

  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
      Accelerometer.find({
        tS: {
          '$gte': req.query.start,
          '$lt': req.query.end
        },
        user: user
      }).sort({'tS':-1}).limit(1000).exec((function (err, acc) {
        if (err) {
          console.log(err);
        } else {
          var accData = [];
          // console.log(acc);
          acc.forEach(function (row) {
            var tmp = {
              x: row.x,
              y: row.y,
              z: row.z,
              t: row.tS
            }
            accData.push(tmp);
          });
          Gyro.find({
            tS: {
              '$gte': req.query.start,
              '$lt': req.query.end
            },
            user: user
          }).sort({'tS':-1}).limit(1000).exec((function (err, gyro) {
            if (err) {
              console.log(err);
            } else {
              var gyroData = [];
              gyro.forEach(function (row) {
                var tmp = {
                  x: row.x,
                  y: row.y,
                  z: row.z,
                  t: row.tS
                }
                gyroData.push(tmp);
              });
                    Android.find({
                      tS: {
                        '$gte': req.query.start,
                        '$lt': req.query.end
                      },
                      user: user
                    }).sort({ 'tS': -1 }).limit(1000).exec((function (err, android) {
                      if (err) {
                        console.log(err);
                      } else {
                        var telData = [];
                        // console.log(gps);
                        android.forEach(function (row) {
                          // console.log(row);
                          var tmp = {
                            x: row.x,
                            y: row.y,
                            z: row.z,
                            t: row.tS
                          }
                          telData.push(tmp);
                        });
                        Watch.find({
                          tS: {
                            '$gte': req.query.start,
                            '$lt': req.query.end
                          },
                          user: user
                        }).sort({ 'tS': -1 }).limit(1000).exec((function (err, watch) {
                          if (err) {
                            console.log(err);
                          } else {
                            var watchData = [];
                            watch.forEach(function (row) {
                              var tmp = {
                                x: row.hR,
                                t: row.tS
                              }
                              watchData.push(tmp);
                            });
                               GPS.find({
                                 tS: {
                                   '$gte': req.query.start,
                                   '$lt': req.query.end
                                 },
                                 user: user
                               }).sort({
                                 'tS': -1
                                 }).limit(1000).exec((function (err, gps) {
                                 if (err) {
                                   console.log(err);
                                 } else {
                                  //  console.log(gps);
                                   var gpsData = [];
                                   gps.forEach(function (row) {
                                    //  console.log(row);
                                     var tmp = {
                                       lat: row.lat,
                                       lon: row.lon
                                     }
                                     gpsData.push(tmp);
                                   });
                                   //OBD
                                   OBD.find({
                                     tS: {
                                       '$gte': req.query.start,
                                       '$lt': req.query.end
                                     },
                                     user: user
                                   }).sort({
                                     'tS': -1
                                     }).limit(1000).exec((function (err, obd) {
                                     if (err) {
                                       console.log(err);
                                     } else {
                                       //  console.log(gps);
                                       var obdData = [];
                                       obd.forEach(function (row) {
                                         //  console.log(row);
                                         var tmp = {
                                           speed: row.speed,
                                           rpm: row.rpm,
                                           t: row.tS
                                         }
                                         obdData.push(tmp);
                                       });
                                       res.render("user/data/acc", {
                                         accData: accData,
                                         gyroData: gyroData,
                                         watchData: watchData,
                                         telData: telData,
                                         gpsData: gpsData,
                                         obdData: obdData
                                       });
                                     }
                                   }))

                                  
                                 }
                               }))
                               
                            
                            
                          }
                        }))
                      }
                    }))
            }
          }))
        }
      }))
          }
        })
      
});


router.get("/watch", function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.render("company/watchLive", {user: user});
    }
    });
});



module.exports = router;