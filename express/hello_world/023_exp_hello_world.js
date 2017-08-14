var express = require('express'),
	 	app = express(),
		path = require("path");

/* PROPERTIES AND MIDDLEWARES ------------------------------------------ */
// disable default header x-powered-by Express
app.disable('x-powered-by');

// custom logging middleware, it prints in console lines such as
// 2017-08-12 10:57:08] ::ffff:127.0.0.1 GET /?param=1
app.use(function(req, response, next) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
	    requestTime = new Date().toISOString().replace('T', ' ').substr(0, 19);
	console.log(requestTime + "] " + ip + " " + req.method + " " + req.url);
	next();
});

// for serving static resurces (css, js, images)
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

/* ROUTING ----------------------------------------------------------- */
// this route could be tested with curl -G http://localhost:3000
app.get('/', function (req, res) {
	res.writeHead(200, { "Content-Type": "text/html" });
	res.end('<h3>Hello World!</h3>');
});

// dynamic routing
app.get('/echo/:page', function (req, res) {
	res.writeHead(200, { "Content-Type": "text/html" });
	res.end('<pre>' + req.params.page + '</pre>');	// do not use as is
});

app.use(function(req, res) {
	res.status(404);
	res.send("Resource not found!");
});

// shortend for http.createServer(app).listen(3000)
app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
