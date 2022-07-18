var express = require("express");
var router = express.Router({mergeParams:true});
var passport = require("passport");
var User = require("../models/user");
var Accelerometer = require("../models/accelerometer");
var Gyro = require("../models/gyro");
var Subscription = require("../models/subscription");
var Blackbox = require("../models/blackbox");
var Settings = require("../models/settings");
var router = express.Router({mergeParams:true});
var middleware = require("./middleware/index");


router.use(function(req, res, next) {
   res.locals.currentUser = req.user; 
   next();
});

router.get("/", middleware.isLoggedIn,function(req, res){
    
    switch (req.user.role) {
        case 'admin':
            res.render("admin/index",{currentUser: req.user});
            break;
        case 'user':
            res.render("user/index",{currentUser: req.user});
            break;
        case 'company':
            res.render("company/index",{currentUser: req.user});
            break;
        case 'callCenter':
            res.render("callCenter/index",{currentUser: req.user});
            break;
        default:
            res.render("user/index",{currentUser: req.user});
            break;
    }
});
    


//show user register form
router.get("/register", function(req, res){
  res.render("register");
});


//handle sign up
router.post("/register", function(req, res){
  var newUser = new User(req.body.user);
  newUser.email = req.body.email;
  newUser.role = "user";
  User.register(newUser, req.body.password, function(err, user) {
    if(err){
      console.log(err);
      return res.render('register');
    } else {
        var setting = {
            acc : 0.1,
            android : 0.1,
            obd : 0.1,
            gps : 0.1,
            user : user._id
        }
        Settings.create(setting, function(err, set) {
            if (err) {
                console.log(err);
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/");
                });
            }
        });
     
    }
  });
});


//show login form
router.get("/login",function(req, res) {
    res.render("login");    
});
//handle login
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res) {
});
//logout
router.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/login");
});

//show all users
router.get("/subscriptions", middleware.isAdmin, function(req, res) {
    var list = [];
    var sub;
    var counter = 0;
    Subscription.find({}, function(err, subs) {
       if (err) {
           console.log(err);
       } else {
           subs.forEach(function(s) {
               User.findById(s.user, function(err, user) {
                   if (err) {
                       console.log(err);
                   } else {
                       console.log(user);
                       sub = {
                           name: user.name,
                           surname: user.surname,
                           date: s.baslamaTarih
                       }
                       list.push(sub);
                       counter++;
                        if (counter === subs.length) {
                            console.log(list);
                            res.render("admin/subscriptions", {list: list});
                        }
                   }
               });
               
               
           });
       }
    });
    
});


//show subscription form
router.get("/subscription/new", middleware.isCallCenter, function(req, res) {
    res.render("callCenter/register");
});

//Create New Subscription
router.post("/subscription", middleware.isCallCenter, function(req, res) {
    var subs = new Subscription(req.body.subscription);
    subs.baslamaTarih = Date.now();
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            Blackbox.findOne({macAddress: req.body.blackbox}, function(err, blackbox) {
                if (err) {
                    console.log(err);
                } else {
                    subs.user = user._id;
                    subs.blackbox = blackbox._id;
                    Subscription.create(subs, function(err, sub) {
                       if (err) {
                           console.log(err);
                       } else {
                           res.redirect("/");
                       }
                    });
                }
            })
        }
    });
});



//New Call Center Form
router.get("/callCenter/new", middleware.isAdmin, function(req, res) {
   res.render("admin/callCenter"); 
});

//Create new call center user
router.post("/callCenter", middleware.isAdmin, function(req, res) {
    var newUser = new User(req.body.user);
    newUser.email = req.body.email;
    newUser.role = "callCenter";
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    }
)});

//New company Form
router.get("/company/new",middleware.isCallCenter, function(req, res) {
   res.render("callCenter/company"); 
});
//create new company
router.post("/company",middleware.isCallCenter, function(req, res) {
    var newUser = new User(req.body.user);
    newUser.email = req.body.email;
    newUser.role = "company";
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    }
)});

//Bir firmanın çalışanlarını listele
router.get("/drivers", middleware.isCompany, function(req, res) {
   User.find({company: req.user.company, role:"user"}, function(err, users) {
       if (err) {
           console.log(err);
       } else {
           res.render("company/users", {list: users});
       }
   });
});

//kullanıcı ayarlarını getir
router.get("/:id/setting", function (req, res) {
    User.findOne({macAddress: req.params.id}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            Settings.findOne({ user: user._id }, function(err, setting) {
                if (err) {
                    console.log(err);
                } else {
                    var newSettings = {
                        acc : setting.acc,
                        android : setting.android,
                        obd : setting.obd,
                        gps : setting.gps
                    }
                    res.send(newSettings);
                }
            });
        }
    });
   
});

router.get("/:id/settings/update", middleware.isLoggedIn, function(req, res) {
    Settings.findOne({user: req.params.id}, function(err, set) {
        if (err) {
            console.log(err);
        } else {
            res.render("user/setting", {set:set, user:req.params.id});
        }
    });
});

router.post("/:id/settings", middleware.isLoggedIn, function(req, res) {
    Settings.findOne({user: req.params.id}, function(err, set) {
        if (err) {
            console.log(err);
        } else {
            set.acc = req.body.acc;
            set.obd = req.body.obd;
            set.android = req.body.android;
            set.gps = req.body.gps;
            set.save(function(err, newSet){
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect("/");
                }
            })
        }
    });
});

module.exports = router;