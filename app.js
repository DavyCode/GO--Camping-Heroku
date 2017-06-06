var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    flash = require('connect-flash'),
    passport = require('passport'),
    methodOverride = require('method-override'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    app = express();

var Comment = require("./models/comment");


//require route 
var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campground'),
    indexRoutes = require('./routes/index');


// Connect to database
// var db = mongoose.connect("mongodb://127.0.0.1:27017/GO_Camping");
const db = mongoose.connect("mongodb://davycode:swood/66@ds111622.mlab.com:11622/gocamping") || mongoose.connect("mongodb://127.0.0.1:27017/GO_Camping");




app.use(bodyParser.urlencoded({ extended: true }));
//default view engine
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();  // seed database 


// ==========
// PASSPORT CONFIG
// ==============================
app.use(require('express-session')({
    secret: "passport working magic",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

//use routes
app.use('/', indexRoutes);
app.use('/campground/:id/comment', commentRoutes);
app.use('/campground', campgroundRoutes);



//Setup the port for the server to listen on ==> port 3000
const PORT = process.env.PORT || 3000;

// Start the server, listening on port = PORT
app.listen(PORT);