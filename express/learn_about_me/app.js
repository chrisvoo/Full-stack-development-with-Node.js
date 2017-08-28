var express = require("express"),
    mongoose = require("mongoose"),
    path = require("path"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    flash = require("connect-flash"),
    routes = require("./routes"),
    passport = require("passport"),
    setUpPassport = require("./setuppassport"),
    csrf = require("csurf"),
    app = express();

// promise and connection's options for avoiding
// warnings. See also http://mongoosejs.com/docs/connections.html#use-mongo-client
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/test", {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});
setUpPassport();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Setting body-parser’s extended option to false makes the parsing simpler and more secure.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX", // allows each session to be encrypted from the clients.
  resave: true, // when true, the session will be updated even when it hasn’t been modified
  saveUninitialized: true // resets sessions that are uninitialized
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());

app.use(routes);

app.listen(app.get("port"), function() {
  console.log("Server started on port " + app.get("port"));
});
