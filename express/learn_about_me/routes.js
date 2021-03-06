var express = require("express");
var User = require("./models/user");
var router = express.Router();
var passport = require("passport");

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

/* Middleware for ensuring a user is authenticated */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page.");
    res.redirect("/login");
  }
}

/* ---------- PAGES ------------- */
router.get("/", function(req, res, next) {
  // You don’t actually run the query until exec is called
  User.find()
      .sort({ createdAt: "descending" })
      .exec(function(err, users) {
          if (err) { return next(err); }
          res.render("index", { users: users });
      });
});

router.get("/users/:username", function(req, res, next) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(404); }
    res.render("profile", { user: user });
  });
});

/* ----------- LOGIN / LOGOUT -------------- */
router.get("/login", function(req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout", function(req, res) {
  req.logout(); // added by Passport
  res.redirect("/");
});

/* ---------- EDIT -------------- */
router.get("/edit", ensureAuthenticated, function(req, res) {
  res.render("edit", {csrfToken: req.csrfToken()});
});

router.post("/edit", ensureAuthenticated, function(req, res, next) {
  req.user.displayName = req.body.displayname;
  req.user.bio = req.body.bio;
  req.user.save(function(err) {
    if (err) {
      next(err);
      return;
    }
    req.flash("info", "Profile updated!");
    res.redirect("/edit");
  });
});

/* ----------- SIGNUP -------------- */
router.get("/signup", function(req, res) {
  res.render("signup");
});

/* It effectively saves a user in a MongoDB collection inside
 * test dtabase. Here is it a sample document you can view from
 * Mongo after having submitted signup form:

 > use test
switched to db test
> db.users.find()
{ "_id" : ObjectId("599c05214cb2cf6b4aad8cab"), "username" : "ccastelli",
  "password" : "$2a$10$LAJWwhUYvMTDB3l2I2Kfi.axCMbJIo9SFoPX2HrHNDdsXzSn2tpwC",
  "createdAt" : ISODate("2017-08-22T10:19:13.332Z"), "__v" : 0 }
*/
router.post("/signup", function(req, res, next) {
    // body-parser adds the username and password to req.body.
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({ username: username }, function(err, user) {
      if (err) { return next(err); }
      if (user) {
        req.flash("error", "User already exists");
        return res.redirect("/signup");
      }
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(next);
    });
  },
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
  })
);

module.exports = router;
