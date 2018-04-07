'use strict';

const fs = require('fs');
// Creates .env file with defaults if it does not exist.
let env = '.env';
if (!fs.existsSync(env)) {
  console.log('.env does not exist! Creating it.');
  fs.writeFileSync('.env', fs.readFileSync('.env.tmp'));
};
require('dotenv').config();
const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT;
const app = express();
app.use(cors());

var heartbeat;

// static files
app.use(express.static('public'));

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/heartbeat', function (req, res) {
  if(req.query.id){
    let heartbeat = req.body.heartbeat;
    setTime();
    // let id = req.query.id;
    if(heartbeat === false) {
      res.send('Server Is Not Responding!');
    }
  } else {//if signal is DEAD
    setTime();
    res.sendFile(__dirname + '/public/index.html');
  }; 
});

let currentTime = [];
let resetTime = [];
let timeout = 5; //time in seconds.

function setTime() {
  currentTime = new Date().getTime();
  heartbeat = true;
  resetTime = currentTime + (1000 * timeout);
};
setTime();

setInterval(function(){
  currentTime = new Date().getTime();
  // console.log ('Time left:', Math.round(resetTime / 1000) - Math.round(currentTime / 1000));
  if (resetTime < currentTime) {
    heartbeat = false;
  };
  console.log(heartbeat);
}, 1000 * 1);



const server = app.listen(process.env.PORT, () => {
  console.log('Listening on port:', PORT, 'use CTRL+C to close.');
});

const io = socket(server);

io.on('connection', function(socket){
  console.log('made socket connection', socket.id);
  io.emit('status', heartbeat);

  socket.on('setInterval', (heartbeat) => {
    io.sockets.emit('status', heartbeat);
  });
});