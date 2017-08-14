	// https://www.npmjs.com/package/commander
	var program = require('commander');
	
	function range(val) {
	  return val.split('..').map(Number);
	}
	 
	function list(val) {
	  return val.split(',');
	}
	 
	function collect(val, memo) {
	  memo.push(val);
	  return memo;
	}
	 
	function increaseVerbosity(v, total) {
	  return total + 1;
	}
	
	program
		.version ('0.0.1')
		.option('-s, --source [web site]', 'Source web site')
		.option('-f, --file [file name]', 'File name')
		.option('-i, --integer <n>', 'An integer argument', parseInt)
		.option('-f, --float <n>', 'A float argument', parseFloat)
		.option('-r, --range <a>..<b>', 'A range', range)
		.option('-l, --list <items>', 'A list', list)
		.option('-o, --optional [value]', 'An optional value')
		.option('-c, --collect [value]', 'A repeatable value', collect, [])
		.option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
		.option('-s --size <size>', 'Pizza size', /^(large|medium|small)$/i, 'medium')
		.parse(process.argv);
	
	if (program.source) console.log(" Source: %s", program.source);
	if (program.file) console.log(" File: %s", program.file);
	if (program.integer) console.log(' int: %j', program.integer);
	if (program.float) console.log(' float: %j', program.float);
	if (program.optional) console.log(' optional: %j', program.optional);
	
	program.range = program.range || [];
	if (program.range.length) console.log(' range: %j..%j', program.range[0], program.range[1]);
	if (program.list) console.log(' list: %j', program.list);
	if (program.collect) console.log(' collect: %j', program.collect);
	if (program.verbose) console.log(' verbosity: %j', program.verbose);
	if (program.args) console.log(' args: %j', program.args);
	console.log(' size: %j', program.size);
	
