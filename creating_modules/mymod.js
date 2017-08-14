/* You can also create a module consisting of an object constructor or function, and
 * export it using module.exports */

exports.concatArray = function(str, array) {
   return array.map(function(element) {
 	return str + ' ' + element;
   });
};
