
var app = require("../app");
var supertest = require("supertest");
var cheerio = require("cheerio");

describe("html response", function() {
	var request;
	beforeEach(function() {
		request = supertest(app)							// wrap your app up
			.get("/")										// route you want to request
			.set("User-Agent", "a cool browser")
			.set("Accept", "text/html");
	});	
	
	/* Your first test will need to make a request to the server, making sure to set the
	 * Accept header to text/plain , and once it gets a response from the server, your test 
	 * should ensure that it comes back as text/plain . */
	it("returns an HTML response", function(done) {
		request
			.expect("Content-Type", /html/)			// regular expression, the response could contains also the charset
			.expect(200)
			.end(done);								// done is a callback passed to you by Mocha, used to signal that asyn tests are all done.
	});

	// pretty similar to the previous one, but you’ll test the response body
	it("returns your User Agent", function(done) {
		request
			.expect(function(res) {
				// we look for a specific element with a class named "user-agent", 
				// in short Cheerio is jQuery for Node
				var htmlResponse = res.text;
				var $ = cheerio.load(htmlResponse);
				var userAgent = $(".user-agent").html().trim();
				if (userAgent !== "a cool browser") {
					throw new Error("User Agent not found");
				}
			})
			.end(done);
	});
});

