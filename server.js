var express = require("express");
var open = require("open");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var schema = require("./schema");
var port = process.env.PORT || 3000;
var connectDb = require('./connectdb');
var BASE_URL = process.env.PORT ? "https://image-search-0904.herokuapp.com/" : "http://localhost:3000";
var PRIVATE = require('./private');
var Bing = require('node-bing-api')({ accKey: PRIVATE.accKey });

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));//Log every request to the console

app.get("/",function(req,res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/api/imagesearch/:string',function(req,res) {
	//Search image 
	Bing.images(req.params.string, {top: 10,adult: 'Strict'}, function(error, result, body){
	  if(body)
	  {
	  	var obj = [];
	  	schema.create({
			term: req.params.string
		},function(err3,result3) {
			//Do nothing
		});
	  	for(var i=0 ; i <= 9 ; i++ )
		  	{
			var data = body.d.results[i];
			var item = {};
	  		item.title = data["Title"];
	  		item.img = data["MediaUrl"];
	  		obj.push(item);
		  	}
	  	if(obj.length !== 0)
	  		res.json(JSON.parse(JSON.stringify(obj)));
	  }
	});
	//Return the JSON response
});

app.get('/api/latest/imagesearch',function(req,res) {
	//Get 10 last searches
	schema.find().sort("-when").limit(req.query.latest || 10).exec(function(err,result) {
		if (result) {
			if(result.length === 0){
			res.json({
					"result":"No results found."
				});
			}
			else {
				res.json(result);
			}	
		}			
	});
});

app.listen(port,function() {
	var url = "http://localhost:"+port;
	console.log("MAGIC HAPPENING @ " + url);
	open(url);
});