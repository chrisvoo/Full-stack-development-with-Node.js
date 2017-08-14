const inputChecker = require('./020_classes.js').InputChecker;

// testing new object and event handling
let ic = new inputChecker('Shelley','output');
ic.on('write', function(data) {
   this.writeStream.write(data, 'utf8');
});

ic.on('echo', (data) => {
   process.stdout.write(ic.name + ' wrote ' + data);
});

ic.on('end', () => {
   process.stdout.write(ic.writeStream.bytesWritten + " bytes written. Shutting down in 2 seconds\n");
	// async function similar to the one in the browser. Also setInterval is pretty the same.
	// we don’t have absolute control over the environment, and factors could slightly delay the timer.
	// setImmediate() creates an event, but the event has precedence over those created by setTimeout() and 
	// setInterval()
	setTimeout(function(name) {
		console.log(name);
		process.exit();
	}, 2000, 'Bye');
});


// capture input after setting encoding
process.stdin.setEncoding('utf8');
process.stdin.on('readable', function() {
  let input = process.stdin.read();
  if (input !== null)
     ic.check(input);
});
