  const assert = require('assert'),
  const nodeunit = require('nodeunit');
  
  var val = 3;
		 // actual, expected, message
  assert.equal(val, 3, 'Test 1 Not Equal');
  assert.ok(val == 3, 'Test 1 Not Equal');		// alias for assert.equal
  assert.ifError(false);		// only if the value resolves to anything but false
  
  try {
	var val = 3;
			// value, expression, message an operator
	assert.fail(val, 4, 'Fails Not Equal', '==');
  } catch(e) {
	console.log(e);
  }
