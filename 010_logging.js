	console.time('block-label');
	
	var util = require('util'),
		today = new Date(),
		test = {
			a : {
				b : {
					c : {
						d : 'test'
					},
					c2 : 3.50
				},
				b2 : true
			},
			a2: today
	};

	util.inspect.styles.boolean = 'blue';

	var str = util.inspect(test, {depth: 4, colors: true });
	console.log("output with util.inspect direct formatting: ------------\n");
	console.log(str);
	console.log("output using console.dir and options: ------------\n");
	console.dir(test, {depth: 4, colors: true});
	console.log("output using basic console.log: ------------\n");
	console.log(test);
	console.log("JSON stringify: ------------\n");
	console.log(JSON.stringify(test, null, 4));

	console.timeEnd('block-label');
