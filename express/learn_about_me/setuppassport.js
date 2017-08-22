/* Because all of your user models have a unique _id property, you’ll use that as your
translation. */
var passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy,
    User = require("./models/user");
    
module.exports = function() {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

passport.use("login", new LocalStrategy(
 function(username, password, done) {
   User.findOne({ username: username }, function(err, user) {
     if (err) { return done(err); }
     if (!user) {
       return done(null, false, { message: "No user has that username!" });
     }

     user.checkPassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Invalid password." });
      }
    });
  });
}));
