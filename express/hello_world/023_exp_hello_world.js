var express = require('express'),
	 	app = express(),
		path = require("path");

/* PROPERTIES AND MIDDLEWARES ------------------------------------------ */
// disable default header x-powered-by Express
app.disable('x-powered-by');
var apiRouter = require("./routers/api");

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
/* you could put a path as first param, so it does not serve files in root /
 * It can applies multiple times for serving static resources from many other directories.
 * The order matters, so if a file name is in both directories, it will be served
 * the one in the first defined static middleware */
app.use(express.static(publicPath));

/* ROUTING ----------------------------------------------------------- */
// router
app.use("/api", apiRouter);

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

// regexp
app.get(/^\/users\/(\d+)$/, function(req, res) {
	res.writeHead(200, { "Content-Type": "text/html" });
  var userId = parseInt(req.params[0], 10);
	if(req.query.q) {
		// it could be a string or an array, in case a param recurs multiple timez
		console.log(req.query.q);
		userId += " and " + req.query.q
	}
	res.end('<pre>' + userId  + '</pre>');
});

// error handler as last middleware
app.use(function(req, res) {
	res.writeHead(404, { "Content-Type": "text/html" });
	res.end("<h2>Error: 404!</h2>")
});

// shortend for http.createServer(app).listen(3000)
app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
