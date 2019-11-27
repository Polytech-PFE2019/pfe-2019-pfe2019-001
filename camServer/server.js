const cv = require('opencv4nodejs');
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const wCap = new cv.VideoCapture(0);
var recording = null;

const FPS = 10;
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/start', (req, res) => {
  if (recording != null) return;
  recording = setInterval(() => {
    const frame = wCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64');
    io.emit('image', image);
    //console.log('sending image');
  }, 1000 / FPS);
});

app.get('/stop', (req, res) => {
  if (recording == null) return;
  clearInterval(recording);
  recording = null;
});

io.on('connection', function(socket){
  console.log('User connected, starting to record...');
  if (recording == null) start();
  console.log("clients: " + Object.keys(io.sockets.sockets).length);
  socket.on('live', function(msg) {
    console.log("Message: " + msg);
    if(msg == true) {
      start();
    } else {
      stop();
    }
  });

  socket.on('disconnect', function() {
    console.log("clients: " + Object.keys(io.sockets.sockets).length);
    if (Object.keys(io.sockets.sockets).length == 0) {
      stop();
    }
  });
});

function start() {
  if (recording != null) return;
  console.log("Start recording");
  recording = setInterval(() => {
    const frame = wCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64');
    io.emit('image', image);
    //console.log('sending image');
  }, 1000 / FPS);
}

function stop() {
  if (recording == null) return;
  console.log("Stop recording");
  clearInterval(recording);
  recording = null;
}




server.listen(3000);
