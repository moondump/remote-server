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
const PORT = process.env.PORT;
const app = express();

// app.post('/heartbeat', function (req, res) {
//   if(req.query.id){
//     // let id = req.query.id;
//     if('signal is ALIVE') {
//       res.sendFile(__dirname + '/public/index.html');
//     }
//   } else {//if signal is DEAD
//     res.send('Server Is Not Responding!');
//   };
let heartbeat = false;
app.get('/heartbeat', function (req, res) {
  if(req.query.id){
    // let id = req.query.id;
    if(heartbeat !== false) {
      res.sendFile(__dirname + '/public/index.html');
    }
  } else {//if signal is DEAD
    res.send('Server Is Not Responding!');
  }; 
});

// let date = new Date();
var enabled = true;
var disabled = false;

var heartbeat;//TEST
heartbeat = enabled;//TEST

setInterval(function(){
  if(heartbeat === enabled) {
    console.log('true');
  }
  if(heartbeat === disabled) {
    console.log('false');
  }
}, 1000);



app.listen(process.env.PORT, () => {
  console.log('Listening on port:', PORT, 'use CTRL+C to close.');
});