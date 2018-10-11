var bodyParser   =               require("body-parser"),
    mongoose     =               require("mongoose"),
    express      =               require("express"),
    passport     = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB       =               require("./seed"),
    app          =               express(),
    expressWs = require('express-ws')(app),
    User   =  require("./models/user"),
    GPS = require("./models/gps");


var port = 3000;


//TO-DO: Gerekli Sekilde düzenle
var indexRoutes = require("./routes/index"),
    websocketRoutes = require("./routes/socket"),
    dataRoutes = require("./routes/data");

// mongoose config
mongoose.connect("mongodb://localhost/black_box");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));


//Passport Config
app.use(require("express-session")({
    secret: "theblackboxproject",
    resave: false,
    saveUninitialized: false
}));    
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

    
    
    
// seed DB
//  seedDB();    



//Gerekli Sekilde Düzenle
app.use("/",indexRoutes);
app.use("/ws",websocketRoutes);
app.use("/:id",dataRoutes);




app.listen(port , function() {
    console.log("SERVER IS LISTENING ON PORT " + port);
});