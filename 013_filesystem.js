"use strict";

var fs = require('fs'),
	util = require('util'),
	Mode = require('stat-mode'),
	path = require('path');

// file information
fs.stat('./Learning Node, 2nd Edition.pdf', function(err,stats) {
	if (err) return console.log(err);
	
	// get permissions
	var mode = new Mode(stats);
	
	var lastAccess = stats.atime,
		size = stats.size;				// bytes	
		
	console.log("File: " + size + " bytes, last accessed on " + lastAccess);
	console.log("Permissions: " + mode.toString());
	console.log('Group execute ' + mode.group.execute);
	console.log('Others write ' + mode.others.write);
	console.log('Owner read ' + mode.owner.read);
});

// file watching
var chokidar = require('chokidar');
var watcher = chokidar.watch('.', {
	ignored: [
		/[\/\\/]\./,		// .dotfiles
		'node_modules',		// saves modules
	],
	persistent: true
});

var log = console.log.bind(console);
	watcher
		.on('add',  path => log(`File ${path} has been added`))
		.on('unlink', function(path) { log('File', path, 'has been removed'); })
		.on('addDir', function(path) { log('Directory', path, 'has been added'); })
		.on('unlinkDir', function(path) {
			log('Directory', path, 'has been removed'); })
		.on('error', function(error) { log('Error happened', error); })
		.on('ready', function() { log('Initial scan complete. Ready for changes.'); })
		.on('raw', function(event, path, details) {
			log('Raw event info:', event, path, details); 
		});
	
	watcher.on('change', function(path, stats) {
		if (stats) log('File', path, 'changed size to', stats.size);
	});

	// stop watching after two seconds
	setTimeout(() => watcher.close(), 2000);


// file read/write with file descriptor
// Open file for reading and appending. The file is created if it does not exist.
// ES6 mode 0o744,  parseInt('0744',8) or '0744'
// nested callback, async waterfall it's perfect for this case, but now we're not interested
fs.open('./new.txt','a+', parseInt('0744',8), function(err, fd) {		
	if (err) return console.error(err);
	fs.write(fd, 'First line', 'utf-8', function(err,written, str) {
		if (err) return console.error(err);
		var buf = new Buffer(written);
		fs.read(fd, buf, 0, written, 0, function (err, bytes, buffer) {
			if (err) return console.error(err);
			console.log(buf.toString('utf8'));
			
			// removes textual files by scanning directory
			fs.readdir ('./',function(err, files) {
				for (let file of files) {
					// removes previously text files created
					if (path.extname(file) == '.txt') {
						fs.unlink('./' + file);
					}
				}
			});
		});
	});
});



