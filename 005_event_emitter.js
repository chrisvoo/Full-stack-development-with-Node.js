"use strict";		// using ES6 features
var util = require('util'),
    eventEmitter = require('events').EventEmitter,
    fs = require('fs');
    
function InputChecker (name, file) {
	this.name = name;
	this.writeStream = fs.createWriteStream('./resources/' + file + '.txt', {
		'flags' : 'w',
		'encoding' : 'utf8',
		/* Because I’m using strict mode, though, I can’t use octal 
		 * literals (such as 0666) in the write stream file descriptor flags. 
		 * Instead, I use the notation 0o666 , which is an ES6-style literal. */
		'mode' : 0o666,
		 autoClose: true
	});
};

util.inherits(InputChecker,eventEmitter);

InputChecker.prototype.check = function check(input) {
	// trim extraneous white space
	let command = input.trim().substr(0,3);
	// process command
	switch(command) {
		case 'wr:': {
			this.emit('write', input.substr(3,input.length));
		} break;
		
		case 'en:': {
			this.emit('end');
		} break;
		
		case 'once:': {
			this.emit('once');
		} break;
		
		default: {
			this.emit('echo',input);
		}
	}
};

// testing new object and event handling
let ic = new InputChecker('Shelley','output');
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
