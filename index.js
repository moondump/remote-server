'use strict';

// https://shiot-remote-server.herokuapp.com/
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
var nodemailer = require('nodemailer');
const PORT = process.env.PORT;
const app = express();
app.use(cors());

var heartbeat;
var count = 0;

// static files
app.use(express.static('public'));

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/heartbeat', function (req, res) {
  if (req.query.id) {
    let heartbeat = req.body.heartbeat;
    setTime();
    // let id = req.query.id;
    if (heartbeat === false) {
      res.send('Server Is Not Responding!');
    }
  } else {//if signal is DEAD
    setTime();
    res.sendFile(__dirname + '/public/index.html');
    count = 0;
    console.log(`Heartbeat Is Now: ${heartbeat}`);
    console.log(`Count Is Now: ${count}`);
  };
});
let currentTime = [];
let resetTime = [];
let timeout = 5; //time in seconds.
let heartCheck = 10; //how often to check heartbeat status.

function setTime() {
  currentTime = new Date().getTime();
  heartbeat = true;
  resetTime = currentTime + (1000 * timeout);
};
setTime();

setInterval(function () {
  currentTime = new Date().getTime();
  console.log ('Time Left:', Math.round(resetTime / 1000) - Math.round(currentTime / 1000));
  if (resetTime < currentTime) {
    heartbeat = false;
  };
  if (!heartbeat) {
    if (count < 1){
      count++;
      sysDown();
    } else {
      console.log(`Heartbeat Is: ${heartbeat}`);
      console.log(`Count Is: ${count}`);
      return;
    };
  };
  console.log(heartbeat);
  io.sockets.emit('status', heartbeat);
}, 1000 * heartCheck);

// node mailer
function sysDown() {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'SHIoT Device Status',
    text: 'Device Has Gone Down!'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email Sent: ${info.response}`);
    }
  });
};



const server = app.listen(process.env.PORT, () => {
  console.log('Listening on port:', PORT, 'use CTRL+C to close.');
});

const io = socket(server);

io.on('connection', function (socket) {
  console.log('made socket connection', socket.id);
  io.emit('status', heartbeat);

  socket.on('setInterval', (heartbeat) => {
    io.sockets.emit('status', heartbeat);
  });
});