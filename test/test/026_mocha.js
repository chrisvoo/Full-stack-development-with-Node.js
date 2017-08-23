// run npm test in the root of the project
var capitalize = require("../capitalize"),	// requires the function you're going to test
	chai = require("chai"),
	expect = chai.expect,
	User = function(o) {
		var firstName = o.firstName,
		    lastName = o.lastName,
		    birthday = o.birthday;
		    
		this.getName = function() { return firstName + " " + lastName; },
		this.getAge = function() { return new Date() - birthday; },
		this.getBirthday = function() { return birthday; }
	};
	
	// description of the test suite (English not code)
	describe("capitalize", function() {	
		it("capitalizes single words", function() {
			expect(capitalize("express")).to.equal("Express");
			expect(capitalize("cats")).to.equal("Cats");
		});
		
		it("makes the rest of the string lowercase", function() {
			expect(capitalize("javaScript")).to.equal("Javascript");
		});
		
		it("leaves empty strings alone", function() {
			expect(capitalize("")).to.equal("");
		});
		
		it("leaves strings with no words alone", function() {
			expect(capitalize(" ")).to.equal(" ");
			expect(capitalize("123")).to.equal("123");
		});		
		
		/* This will test that calling capitalize with 123 throws an error. For this 
		 * you have to wrap it in a function. This is because you don’t want your test code to
		 * create an error, you want that error to be caught by Chai. */
		it("throws an error if passed a number", function() {
			expect(function() { capitalize(123); }).to.throw(Error);
		});
		
		// Negating tests
		it("changes the value", function() {
			expect(capitalize("foo")).not.to.equal("foo");
		});
	});
	
	describe("User", function() {
		var user;
		/* Runs before every test so that the 
		 * user is defined inside every test */
		beforeEach(function() {
			user = new User({
				firstName: "Douglas",
				lastName: "Reynholm",
				birthday: new Date(1975, 3, 20)
			});
		});

		it("can extract its name", function() {
			expect(user.getName()).to.equal("Douglas Reynholm");
		});

		it("can get its age in milliseconds", function() {
			var now = new Date();
			expect(user.getAge()).to.equal(now - user.getBirthday());
		});
	});
