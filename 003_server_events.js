 /* events are subscribed to using the on() function, which the HTTP server class 
  * inherits from the EventEmitter class */

 var http = require('http');
 var server = http.createServer();

 // do curl http://localhost:8124 to test request event.
 // request/response are respectively a readable and a writable stream
 server.on('request', function (request, response) {
   console.log('request event');
   console.log(request.headers);
   response.writeHead(200, {'Content-Type': 'text/plain'});
   response.end('Hello World\n');
 });
 
 server.on('connection', function() {
   console.log('connection event');
 });
 
 server.listen(8124, function() {
   console.log('listening event');
 });
 
 console.log('Server running on port 8124');
