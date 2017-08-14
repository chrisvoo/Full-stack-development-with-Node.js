var fs = require('fs'),
	async = require('async');
	
	/* async.parallel method calls all of the asynchronous functions at once, and
	 * when they are all finished, calls the optional final callback */
	async.parallel({
		data1 : function (callback) {
			fs.readFile('./resources/fruit1.txt', 'utf8', function(err, data) {
				// data is the content of file
				callback(err, data.trim());
			});
		},
		data2 : function (callback) {
			fs.readFile('./resources/fruit2.txt', 'utf8', function(err, data) {
				callback(err, data.trim());
			});
		},
		data3 : function readData3(callback) {
			fs.readFile('./resources/fruit3.txt', 'utf8', function(err, data) {
				callback(err, data.trim());
			});
		},
	 }, function (err, result) {
		if (err) {
			console.log(err.message);
		} else {
			console.log(result);
		}
	 });	
