var express = require('express');
var app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var bcrypt = require("bcrypt-nodejs");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./app/config/db');
var User = require("./app/models/user")(db);
var exphbs = require("express-handlebars");
var sequelize = require("sequelize");
var port = process.env.PORT || 3000;

app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'super-secret', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, pass, cb){
  var hashedPass = bcrypt.hashSync(pass)
  User.findOne({
    where: {
      username: username
    }
  }).then(function(user, err){
    if (err) { return cb(err); }
    if (!user) {
    return cb(null, false); }
    if (!bcrypt.compareSync(pass, user.password)){
      return cb(null, false); }
    return cb(null, user);
  })
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id).then(function (user) {
    cb(null, user);
    //console.log("this is happening");
  });
});

app.use(function(req, res, next){
  if(req.user){
    res.locals.user = req.user.username
  }
  next()
});


app.get("/", function(req, res){
  res.render("welcome")
});

app.get("/signin", function(req, res){
  res.render("signin")
});

app.get("/signup", function(req, res){
  res.render("signup")
});

app.get("/signout", function(req, res){
  User.update({
      online: false
  },{
      where: {
          // where the username matches the username of the current session
          username: res.locals.user
      }
  }).then(function(result) {
    req.session.destroy()
    res.redirect("/")
  });

});

app.post("/signin", passport.authenticate('local', {
  failureRedirect: '/',
  successRedirect: '/confirm'
}));

app.post("/signup", function(req, res, next){
  User.findOne({
    where: {
     username: req.body.username
    }
  }).then(function(user){
    if(!user){
      User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        photolink: req.body.photolink
      }).then(function(user){
        passport.authenticate("local", {failureRedirect:"/", successRedirect: "/confirm"})(req, res, next)
      })
    } else {
      res.send("user exists")
    }
  })
});

app.get("/confirm", function(req, res){
  User.findOne({
    where: {
     username: res.locals.user
    }
  }).then(function(user){
    res.render("confirm", {user: user})
  })
});

app.post("/confirmuser", function(req, res) {

    User.update({
        displayname: req.body.name,
        age: req.body.age,
        occupation: req.body.occupation,
        photolink: req.body.photo,
        vegetarian: req.body.veg,
        differentDiet: req.body.diet,
        favFood: req.body.favfood,
        leastFood: req.body.leastfood,
        favDrink: req.body.favdrink,
        leastDrink: req.body.leastdrink,
        freeTime: req.body.freetime,
        minAvail: req.body.minavail,
        locationName: req.body.locationname,
        online: true
    },{
        where: {
            // where the username matches the username of the current session
            username: res.locals.user
        }
    }).then(function(result) {
        res.redirect("/geolocation")
    });

});

app.get("/geolocation", function(req, res){
  User.findOne({
    where: {
     username: res.locals.user
    }
  }).then(function(user){
    res.render("geolocation")
  })
});

app.post("/locationupdate", function(req, res){
  User.update({
      locationLat: req.body.lat,
      locationLong: req.body.long
  },{
      where: {
          // where the username matches the username of the current session
          username: res.locals.user
      }
  }).then(function(result) {
      res.redirect("/onlineusers")
  });
})

app.get("/landing", function(req, res){
  User.findOne({
    where: {
     username: res.locals.user
    }
  }).then(function(user){
    res.render("landing", {user: user})
  })
});

app.get("/onlineusers", function(req, res) {
        User.findOne({
          where: {
            username: res.locals.user
          }
        }).then(function(user){
            User.findAll({
              // find all online users
              where: {
                  // who is online - this is set to false when the user signs out
                  online: true,
              },
              limit: 6,
              order: [[sequelize.col("locationLong"), "ASC"]],
              offset: 1
            }).then(function(onlineusers){
              res.render("onlineusers", {user: user, onlineusers: onlineusers})
            })
        })
});


app.listen(port, function() {
  console.log("Listening...")
});
