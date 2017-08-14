
/* shows nesting two levels deep: reading the file in 
 * and then writing the modified content.
 
	var fs = require('fs');
	fs.readFile('./apples.txt','utf8', function(err,data) {
	 if (err) {
		console.error(err.stack);
	 } else {
		var adjData = data.replace(/apple/g,'orange');
		fs.writeFile('./oranges.txt', adjData, function(err) {
			if (err) console.error(err);
		});
	 }
	}); 
* */

/* Bluebird promisifyAll() function is used to promisify all of the File System 
 * functions. Instead of readFile() , we’ll then use readFileAsync() , 
 * which is the version of the function that supports promises. */

var promise = require('bluebird'),
    fs = promise.promisifyAll(require('fs'));
    
fs.readFileAsync('./resources/apples.txt','utf8')
.then(function(data) {
	var adjData = data.replace(/apple/g, 'orange');
	return fs.writeFileAsync('./resources/oranges.txt', adjData);
})
.catch(function(error) {
	console.error(error);
});
