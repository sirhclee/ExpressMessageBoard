var express = require('express');

const post_controller = require("../controllers/postController");
const Post = require("../models/post");

var router = express.Router();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const async = require("async");

const mongoDB = 'mongodb+srv://sirhclee:adapter412@cluster0.zs0ro8u.mongodb.net/local_library?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

//Setup session 
router.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
router.use(express.urlencoded({ extended: false }));

router.post( //index to login (via button)
    "/log-in",
    passport.authenticate("local", { // calls authenticate function on form input 
      successRedirect: "/",
      failureRedirect: "/",
      failureFlash: true //error code
    })
  );


// router.get("/", (req, res) => {
//   res.render("index", {user:req.user}) 
// }); 

router.get("/", post_controller.post_list); 

router.post("/message", post_controller.save_post); 
router.post("/delete", post_controller.delete_post); 





module.exports = router;
