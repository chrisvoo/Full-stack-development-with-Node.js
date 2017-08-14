var dgram = require('dgram');
var client = dgram.createSocket("udp4");

/* Note that we don''t have to set the encoding for the string, since the UDP 
 * socket accepts only a buffer, and the process.stdin data is a buffer. */
process.stdin.on('data', function (data) {
	console.log(data.toString('utf8'));
	client.send(data, 0, data.length, 8124, "localhost",
	function (err, bytes) {
		if (err)
			console.error('error: ' + err);
		else
			console.log('successful');
	});
});
