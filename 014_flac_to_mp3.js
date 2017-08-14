#!/usr/bin/env node

// FLAC converter with ffmpeg
var spawn = require('child_process').spawn,
	program = require('commander');
	
	program
		.version ('0.0.1')
		.option ('-s, --source [file name]', 'Source FLAC file name')
		.option ('-f, --file [file name]', 'Resulting file name')
		.parse(process.argv);
	
	if ((program.source === undefined) || (program.file === undefined)) {
		console.error('source and file must be provided');
		process.exit();
	}	
	
	var flac = program.source,
		outfile = program.file;
		
	// conversion array
	var opts = [
		"-i",
		flac,
		"-codec:a", "libmp3lame",
		"-b:a", "320k",
		"-map_metadata", "0",
		"-id3v2_version", "3",
		outfile
	];	
	
	var im = spawn('ffmpeg', opts);
	
	im.stderr.on('data', (data) => {
		console.log(`${data}`);
	});
	
	im.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
	});
