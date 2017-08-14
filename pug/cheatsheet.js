const pug = require('pug');
process.env.NODE_ENV = 'development';

const express = require('express'),
	 	app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('cheatsheet', {
    pageTitle : "PUG cheatsheet",
    name: 'Chris'
  });
});

app.listen(3000, function () {
	console.log('PUG cheatsheet listening on port 3000!');
});
