var express = require("express");
var ALLOWED_IPS = [
  "127.0.0.1", "::ffff:127.0.0.1"
];

var api = express.Router();
api.use(function(req, res, next) {
  console.log(req.ip);
  var userIsAllowed = ALLOWED_IPS.indexOf(req.ip) !== -1;
  if (!userIsAllowed) {
    res.status(401).send("Not authorized!");
  } else {
    next();
  }
});

api.get("/users", function(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end('Called ' + req.url);
});

module.exports = api;
