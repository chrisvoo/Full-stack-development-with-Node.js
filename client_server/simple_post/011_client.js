
	// to test it with curl
	// curl -X POST http://localhost:8124?action=get -d "param=1"
	var http = require('http'),
		querystring = require('querystring'),
		postData = querystring.stringify({
			'msg' : 'Hello World!'
		}),
		options = {
			hostname: 'localhost',
			port: 8124,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postData.length
			}
		};

	var req = http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		// get data as chunks
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		});
		// end response
		res.on('end', function() {
			console.log('No more data in response.')
		})
	});
	
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	
	// write data to request body
	req.write(postData);
	req.end();
