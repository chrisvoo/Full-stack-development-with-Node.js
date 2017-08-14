const util = require('util');

module.exports = {
	'Test 1' : function(test) {
		test.expect(4);
		test.equal(true, util.isArray([]));
		test.equal(true, util.isArray(new Array(3)));
		test.equal(true, util.isArray([1,2,3]));
		test.notEqual(true, 1 > 2);
		test.done();
	},
	'Test 2' : function(test) {
		test.expect(2);
		test.deepEqual([1,2,3], [1,2,3]);
		test.ok('str' === 'str', 'equal');
		test.done();
	}
};

module.exports.testSomething = function(test) {
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};

module.exports.testSomethingElse = function(test) {
    test.ok(false, "this assertion should fail");
    test.done();
};
