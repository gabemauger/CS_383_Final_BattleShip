const express = require('express');
const app = express();
const socket = require('socket.io');
const port = 3000;
var mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser')




mongoose.connect('mongodb://localhost:27017/userdata', {useNewUrlParser: true}).catch(error => console.log("Something went wrong: " + error));
var User = require("./serve/files/data");
const { db } = require('./serve/files/data');

const server = app.listen(port, function() {
  console.log('App listening on port 3000!');
});

const bodyParser= require('body-parser');
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser());

app.use(function(req, res, next){
	console.log(req.cookies);
	next();
});

app.use(express.static('serve'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = socket(server);
io.on('connection', function (sockett) {
	console.log('Connected');
	var id = 12345;
	sockett.join(id);
	sockett.on('array', function (data) {
		sockett.broadcast.to(id).emit('sendarray', data);
		console.log('Sent array to '+ id);
	});

	sockett.on('turn', function (data) {
		sockett.broadcast.to(id).emit('sendturn');
		console.log('Sent turn to '+ id);
	});

  	sockett.on('hit', function (data, hit) {
		sockett.broadcast.to(id).emit('sendhit', data, hit);
		console.log(data);
		console.log('Sent turn to '+ id);
	});

	sockett.on('win', function (username) {
		sockett.broadcast.to(id).emit('sendwin');
		User.findOne({user: username}, function(err, docs) {
			if(docs){
				docs.wins++;
				docs.save();
				console.log(docs.wins);
			}			
		});
		console.log('Sent win to '+ id);
	});

	sockett.on('gamekey', function (data) {
		sockett.join(data)
		id = data;
		console.log('Joined game ' + data)
	});
});

app.post("*/data", function(req, res){
    var newUser = new User(req.body.data);
	
	User.findOne({user: newUser.user}, function(err, docs) {
		if(!docs){
			newUser.wins = 0;
			newUser.password = bcrypt.hashSync(newUser.password, 10);
			res.cookie('account', newUser.user);
			newUser.save();
			console.log("User " + newUser.user+" added to database");
			res.redirect("/home.html");
		} else {
			res.redirect("regi.html?taken");
		}
	});
});

app.post("*/login", function(req,res){
	var tempUser = new User(req.body.data);

	User.findOne({user: tempUser.user}, function(err, docs) {
		if(docs){
			bcrypt.compare(tempUser.password, docs.password, function(err, result) {
				if(result==true) {
					res.cookie('account', tempUser.user);
					console.log("Logged in!");
					res.redirect("home.html");
				} else {
					res.redirect("log.html?incorrect");
				}
			});
		} else {
			res.redirect("log.html?incorrect");
		}
	});
});

app.get('/leaderboard', (req, res) => {
	console.log("leaderboard loaded")
  User.find().sort({"wins":-1})
	.then(results => {
	  res.render('lead.ejs', { userdatas: results })
	})
	.catch(/* ... */)
	
})