var express = require("express");
var app = express();
var path = require('path');

app.set("port", process.env.PORT || 3000);

var viewsPath = path.join(__dirname, "views");
app.set("view engine", "ejs");
app.set("views", viewsPath);

app.get("/", function(req, res) {
	var userAgent = req.headers["user-agent"] || "none";
	if (req.accepts("html")) {
		res.render("index", { userAgent: userAgent });
	} else {
		res.type("text");
		res.send(userAgent);
	}
});

app.listen(app.get("port"), function() {
	console.log("App started on port " + app.get("port"));
});

/* Normally, when you’re running a file (node app.js or npm start), you don't need to export the app,
 * but when you're testing the application, you'll need it so that the outside world can see it */
module.exports = app;
