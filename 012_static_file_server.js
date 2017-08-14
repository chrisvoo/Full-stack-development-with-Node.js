	var http = require('http'),
	    fs = require('fs'),
	    path = require('path'),				// for normalizing paths (OS support)
	    mime = require('mime'),				// return the proper MIME type given a filename
		base = __dirname + '/resources';	// current working directory for a Node application
	
	http.createServer((req, res) => {
		pathname = path.normalize(base + req.url);
		console.log("Requesting %s", pathname);
	
		// 404 message to the browser if this fails	
		fs.stat(pathname, function(err,stats) {		
			if (err) {
				console.log(err);
				res.writeHead(404);
				res.write('Resource missing 404\n');
				res.end();
			} else {
				var type = mime.lookup(pathname);
				if(stats.isDirectory()) {
					console.log(err);
					res.writeHead(403);
					res.write('Requesting a directory');
					res.end();
				} else {
					res.setHeader('Content-Type', type);
					// create and pipe readable stream
					var file = fs.createReadStream(pathname);
					file.on("open", function() {
						res.statusCode = 200;
						/* attaches a Writable stream to the readable, causing it to switch automatically
						 * into flowing mode and push all of its data to the attached Writable. The flow 
						 * of data will be automatically managed so that the destination Writable stream 
						 * is not overwhelmed by a faster Readable stream */
						file.pipe(res);
					});
					
					file.on("error", function(err) {
						console.log(err);
						res.writeHead(403);
						res.write('file missing or permission problem');
						res.end();
					});
				}
			}
		});	
	}).listen(8124);
	
	console.log('server listening on 8124');
