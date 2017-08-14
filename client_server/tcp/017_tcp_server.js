var net = require('net');
const PORT = 8124;
/* Rather than passing a requestListener to the server creation function, 
 * with its separate response and request objects, the TCP callback 
 * function's sole argument is an instance of a socket that can both send and
 * receive. */
var server = net.createServer(function(conn) {
	console.log('connected');
	// data is received
	conn.on('data', function (data) {
		console.log(data + ' from ' + conn.remoteAddress + ' ' +
					conn.remotePort);
		conn.write('Repeating: ' + data);
	});
	
	// client closes the connection
	conn.on('close', function() {
		console.log('client closed connection');
	});
}).listen(PORT);

server.on('listening', function() {
	console.log('listening on ' + PORT);
});

server.on('error', function(err){
	if (err.code == 'EADDRINUSE') {
		console.warn('Address in use, retrying...');
		setTimeout(() => {
			server.close();
			server.listen(PORT);
		}, 1000);
	}
	else {
		console.error(err);
	}
});
