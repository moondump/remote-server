'use strict';

//Make connection
const socket = io.connect('http://localhost:3002');

// Query DOM
let deviceStatus = document.getElementById('deviceStatus');

// Listen for events
socket.on('status', (data) => {
  let stat = '';
  if (data) {
    stat = 'up';
  } else {
    stat = 'down';
  }
  
  deviceStatus.innerHTML = '<p><strong>SHIoT device is currently ' + stat + '</strong></p>';
});