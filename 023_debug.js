var fs = require('fs');
var test = 10, second = 'test';

for (var i = 0; i <= test; i++) {
	debugger;
	second+=i;
}

setTimeout(function() {
	debugger;
	test = 1000;
	console.log(second);
}, 1000);

fs.readFile('./resources/output.txt', 'utf8', function (err,data) {
	if (err) {
		return console.log(err);
	}
	
	var arry = ['apple','orange','strawberry'],
		arry2 = data.split("\n").concat(arry);
	console.log(arry2);
});
