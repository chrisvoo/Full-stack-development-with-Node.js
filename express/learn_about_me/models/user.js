var mongoose = require("mongoose");
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
