var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require("express-session");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash =  require("connect-flash"); 

const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const async = require("async");

const mongoDB = 'mongodb+srv://sirhclee:adapter412@cluster0.zs0ro8u.mongodb.net/local_library?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model( //Define user/password model
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var formRouter = require('./routes/form');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");


app.use(logger('dev'));
app.use(flash()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) { //allow access to currentUser login
  res.locals.currentUser = req.user;
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/new', formRouter);

passport.use(  //Strategy to match entered data wih database (required for login)
    new LocalStrategy({passReqToCallback:true },

      async(req, username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };

         
          bcrypt.compare(password, user.password, (err, res) => {
              if (res) {
                // passwords match! log user in
                return done(null, user)
              } else {
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" })
              }
            })

        
      } catch(err) {
        return done(err);
      };
    })
  );

passport.serializeUser(function(user, done) { //passport function for cookies (stay logged in)
    done(null, user.id);
  });
  
passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
  });



app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.get("/log-out", (req, res, next) => { //log out 
    req.logout(function (err) { //passport function log out (remove cookies)
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });



app.post("/sign-up", async (req, res, next) => {
  // Create new user account
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        try {          
            const user = new User({ //creates new model object
              username: req.body.username,      
              password: hashedPassword
            }); 
            const result = await user.save(); //
            res.redirect("/");
          } catch(err) {
            return next(err);
          };

      });
    })

module.exports = app;
