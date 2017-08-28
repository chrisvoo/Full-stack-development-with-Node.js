var fs = require("fs"),
    https = require("https");

const crypto = require('crypto');

// openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
var privateKey = fs.readFileSync('resources/ssl_cert/key.pem').toString(),
	certificate = fs.readFileSync('resources/ssl_cert/cert.pem').toString();
	
var options = {
	key: privateKey,
	cert: certificate
};

// port over 1024 so I don't require sudo
https.createServer(options, function(req,res) {
	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
	var pass = "HTTPS and crypt module";
	
	const hash = crypto.createHash('md5')
					   .update(pass)
					   .digest('hex');
					   
    var salt = Math.round((Date.now() * Math.random())) + '',
        saltedPassword = crypto.createHash('sha512')
							   .update(salt + pass, 'utf8')
							   .digest('hex');
        finalMessage = "<ul>" +
						 "<li>MD5: " + hash + "</li>" +		// echo -n "Hello Secure World" | md5sum
						 "<li>Salt: " + salt + "</li>" +
						 "<li>Salted: " + saltedPassword + "</li>" +
					   "</ul>";	 
	
	// save both salt and hash in two DB columns
	res.end(pass + ": " + finalMessage);		
}).listen(1444);
