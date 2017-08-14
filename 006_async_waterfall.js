var fs = require('fs'),
    async = require('async');
 
    /* The async.waterfall takes two parameters: an array of tasks and an 
     * optional final callback function. The callback function allows us 
     * to chain the asynchronous callback results without having to 
     * physically nest the functions */
    async.waterfall([
		function readData(callback) {
		   fs.readFile('./resources/data1.txt', 'utf8', function(err, data){
			callback(err,data);
		   });
		},
		function modify(text, callback) {
		   var adjdata=text.replace(/somecompany\.com/g,'burningbird.net');
		   callback(null, adjdata);
		},
		function writeData(text, callback) {
		   fs.writeFile('./resources/data1.txt', text, function(err) {
			callback(err,text);
		   });
		}
	    ], function (err, result) {
			if (err) {
			   console.error(err.message);
			} else {
			   console.log(result);
			}
		}
	);
