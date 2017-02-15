// // *********************************************************************************
// // controller.js - this file offers a set of routes for displaying and saving data to the db
// // *********************************************************************************

// Dependencies
// =============================================================
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../config/db');
var User = require("../models/user")(db);

// Routes
// =============================================================
module.exports = function(app, passport) {

  app.use(function(req, res, next) {
        if (req.user) {
            res.locals.user = req.user.username
        }
        next()
    });

  // HTML ROUTES==================================================
  // index route loads welcome.handlebars
  app.get("/", function(req, res) {
      res.render("welcome");
  });

  app.get("/landing", function(req, res) {
      res.render("landing");
  });

  app.post("/signup", function(req, res, next) {
      // check if the same username already exists
      db.User.findOne({
          where: {
              username: req.body.usernamesignup
          }
      }).then(function(user) {
          // if the username doesn't exist, proceed to create a new one
          if (!user) {
              db.User.create({
                  username: req.body.usernamesignup,
                  password: bcrypt.hashSync(req.body.passwordsignup),
                  photolink: req.body.photolinksignup,
              }).then(function(user) {
                  // if authentication fails, redirect back to welcome page
                  // if authentication succeeds, redirect to confirm page
                  passport.authenticate("local", { failureRedirect: "/", successRedirect: "/landing" })(req, res, next)
              })
          } else { // if it does, then prevent signing up, redirect back to the welcome page to sign in instead
              res.send("user exists");
              res.redirect("/");
          }
      })
  });

  //sign in link

  app.post("/signin", passport.authenticate('local', {
      failureRedirect: '/',
      successRedirect: '/landing',
      failureFlash: 'Invalid username or password.'
  }));

  app.put("/signout", function(req, res) {
      db.User.update({
        // change the online status to false once signed out
        online: false
      },{
        where: {
          username: req.user.username
        }
      }).then(function(result){
        req.session.destroy()
        res.redirect("/");
      })
  });

}
