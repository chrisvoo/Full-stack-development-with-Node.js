var mongoose = require("mongoose"),
    bcrypt = require("bcrypt-nodejs"),
    SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  displayName: String,
  bio: String
});

/* -------- methods -------- */

/* If the user has defined a display name,
return that; otherwise, return their username */
userSchema.methods.name = function() {
  return this.displayName || this.username;
};

userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

/* A do-nothing function for use with the bcrypt module */
var noop = function() {};


/* Defines a function that runs before model is saved */
userSchema.pre("save", function(done) {
  var user = this;  // Saves a reference to the user
  if (!user.isModified("password")) {
    return done();
  }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
      if (err) { return done(err); }
      user.password = hashedPassword;
      done();
    });
  });
});

var User = mongoose.model("User", userSchema);
module.exports = User;
