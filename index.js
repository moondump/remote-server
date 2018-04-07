'use strict';

const fs = require('fs');
const cors = require('cors');
// Creates .env file with defaults if it does not exist.
let env = '.env';
if (!fs.existsSync(env)) {
  console.log('.env does not exist! Creating it.');
  fs.writeFileSync('.env', fs.readFileSync('.env.tmp'));
};
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT;
const app = express();
app.use(cors);

var heartbeat;


// app.get('/heartbeat', function (req, res) {
//   if(req.query.id){
//     // let id = req.query.id;
//     if('signal is ALIVE') {
//       res.sendFile(__dirname + '/public/index.html');
//     }
//   } else {//if signal is DEAD
//     res.send('Server Is Not Responding!');
//   };
// let heartbeat = false;

app.post('/heartbeat', function (req, res) {
  if(req.query.id){
    // let heartbeat = req.body.heartbeat;
    // setTime();
    // let id = req.query.id;
    if(heartbeat === false) {
      res.send('Server Is Not Responding!');
    }
  } else {//if signal is DEAD
    setTime();
    res.sendFile(__dirname + '/public/index.html');
  }; 
});

// let date = new Date();
// var enabled = true;
// var disabled = false;

// var heartbeat;//TEST
// heartbeat = enabled;//TEST

setInterval(function(){
  if(heartbeat === true) {
    console.log('true');
  }
  if(heartbeat === false) {
    console.log('false');
  }
}, 1000);

let currentTime = [];
let resetTime = [];

function setTime() {
  currentTime = new Date().getTime();
  heartbeat = true;
  resetTime = currentTime + (1000 * 10);
};
setTime();

setInterval(function(){
  currentTime = new Date().getTime();
  console.log('Time left: ', resetTime - currentTime);
  if (resetTime < currentTime) {
    heartbeat = false;
  };
  console.log(heartbeat);
  // app.post('/heartbeat', function (req, res) {
  //   if(req.query.id){
  //     // setTime();
  //     // let id = req.query.id;
  //     if(heartbeat !== false) {
  //       setTime();
  //       res.sendFile(__dirname + '/public/index.html');
  //     }
  //   } else {//if signal is DEAD
  //     res.send('Server Is Not Responding!');
  //   }; 
  // });
}, 1000 * 3);



app.listen(process.env.PORT, () => {
  console.log('Listening on port:', PORT, 'use CTRL+C to close.');
});