const express = require('express');
const app = express();
const socket = require('socket.io');
const port = 3000;
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/userdata', {useNewUrlParser: true}).catch(error => console.log("Something went wrong: " + error));
var User = require("./serve/files/data");

const server = app.listen(port, function() {
  console.log('App listening on port 3000!');
});

app.use(express.static('serve'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

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

  sockett.on('hit', function (data) {
		sockett.broadcast.to(id).emit('sendhit', data);
		console.log('Sent turn to '+ id);
	});

	sockett.on('win', function () {
		sockett.broadcast.to(id).emit('sendwin');
		console.log('Sent win to '+ id);
	});

	sockett.on('gamekey', function (data) {
		sockett.join(data)
		id = data;
		console.log('Joined game ' + data)
	});
});

app.post("/data", function(req, res){
    var newUser = new User(req.body.data);
	
	newUser.wins = 0;
	newUser.save();
	console.log("User added to database");
});