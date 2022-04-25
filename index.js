const express = require('express');
const app = express();
const socket = require('socket.io');
const port = 3000;

const server = app.listen(port, function() {
  console.log("diba");
  console.log('App listening on port 3000!');
});

app.use(express.static('serve'))

const io = socket(server);
io.on('connection', function (sockett) {
	console.log('Connected');
	sockett.on('array', function (data) {
		sockett.broadcast.emit('sendarray', data);
		console.log('Sent array');
	});

	sockett.on('turn', function (data) {
		sockett.broadcast.emit('sendturn');
		console.log('Sent turn');
	});

  sockett.on('hit', function (data) {
		sockett.broadcast.emit('sendhit', data);
		console.log('Sent turn');
	});

	sockett.on('win', function () {
		sockett.broadcast.emit('sendwin');
		console.log('Sent win');
	});
});