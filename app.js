var express                     =   require("express"),
    app                         =   express(),
    bodyParser                  =   require('body-parser'),
    quizRoutes                  =   require("./routes/quiz"),
    userRoutes                  =   require('./routes/user'),
    User                        =   require('./models/user'),
    path                        =   require("path"),
    fs                          =   require("fs"),
    multer                      =   require("multer"),
    mongoose                    =   require("mongoose"),
    ejs                         =   require("ejs"),
    session                     =   require('express-session'),
    passport                    =   require("passport"),
    passportLocalMongoose       =   require("passport-local-mongoose");

//jshint esversion:6
require('dotenv').config();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/quiz", {useNewUrlParser: true});
mongoose.set('useUnifiedTopology', true);
passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.use('/', userRoutes);
app.use('/quiz', quizRoutes);

app.listen(process.env.PORT || 8080, process.env.IP, function(req, res){
    console.log("Server connected ..."); 
});