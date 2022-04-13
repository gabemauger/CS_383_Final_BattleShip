const express = require('express');
const app = express();
const socket = require('socket.io');
const port = 3000;

const server = app.listen(port, function() {
  console.log('App listening on port 3000!');
});

app.use(express.static('serve'))

const io = socket(server);

