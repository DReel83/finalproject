// require and call express.js
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var config     = require('./public/assets/js/config.js');
var base58     = require('./public/assets/js/base58.js');
var Url        = require('./models/url.js');

//Handles JSON 
app.use(bodyParser.json());

//Handles encoded URL's
app.use(bodyParser.urlencoded({ extended: true }));

// The path module is used to concatenate the paths.
var path = require('path');

//The following instructs Express to serve the from
// the designated directory.
app.use(express.static(path.join(__dirname, 'public')));

// home page (index.html) route
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

// home page (index.html) route
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'views/signup.html'));
});

// This route creates the shortened URL 
// and returns it as well.
app.post('/api/shorten', function(req, res){
	//checks to see if the url has already been shortened.
	var longUrl = req.body.url;
	var shortUrl = '';

	Url.findOne({long_url: longUrl}, function (err, doc){
		if (doc){
			shortUrl = config.webhost + base58.encode(doc._id);

			res.send({'shortUrl': shortUrl});

		} else {

			var newUrl = Url({
				long_url: longUrl
			});

			newUrl.save(function(err){
				if (err){
					console.log(err);
				}

				shortUrl = config.webhost + base58.encode(newUrl._id);

				res.send({'shortUrl': shortUrl});
			});
		}

	});
});

// This routes redirects the user to the long URL
// associated with the short URL.
app.get('/:encoded_id', function(req, res){

	var base58Id = req.params.encode_id;
	var id = base58.decode(base58Id);

	//Checks for prexiting URL
	Url.findOne({_id: id}, function (err, doc){
		if (doc) {
			res.redirect(doc.long_url);


		} else {
			res.redirect(config.webhost);
		}
	});
});

// Create and define the sevrer
var server = app.listen(3000, function(){
	console.log("The server is now listening on port 3000");
});
