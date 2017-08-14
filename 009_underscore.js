
	var us = require('underscore');
	
	/* a controlled way to extend Underscore with your own utility 
	 * functions via the mixin function.
	 * Mixin: pattern where properties of one object are added to another. */
	us.mixin({
		betterWithNode: function(str) {
			return str + ' is better with Node';
		}
	});
	
	us.each(['apple','cherry'], function (fruit) { 
		console.log(us.betterWithNode(fruit)); 
	});
