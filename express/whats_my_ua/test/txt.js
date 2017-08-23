
var app = require("../app");
var supertest = require("supertest");

describe("plain text response", function() {
	var request;
	beforeEach(function() {
		request = supertest(app)							// wrap your app up
			.get("/")										// route you want to request
			.set("User-Agent", "my cool browser")
			.set("Accept", "text/plain");
	});	
	
	/* Your first test will need to make a request to the server, making sure to set the
	 * Accept header to text/plain , and once it gets a response from the server, your test 
	 * should ensure that it comes back as text/plain . */
	it("returns a plain text response", function(done) {
		request
			.expect("Content-Type", /text\/plain/)			// regular expression, the response could contains also the charset
			.expect(200)
			.end(done);										// done is a callback passed to you by Mocha, used to signal that asyn tests are all done.
	});

	// pretty similar to the previous one, but you’ll test the response body
	it("returns your User Agent", function(done) {
		request
			.expect(function(res) {
				if (res.text !== "my cool browser") {
					throw new Error("Response does not contain User Agent");
				}
			})
			.end(done);
	});
});
