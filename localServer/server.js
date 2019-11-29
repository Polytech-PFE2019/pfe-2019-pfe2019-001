var express = require("express");
var path = require("path");
var app = express();
const bodyParser = require("body-parser");
var cors = require('cors');

const waterRoutes = require("./routes/waterControl");


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// var firebaseConfig = {
//   apiKey: "AIzaSyCncb_SkW0LNdf2phmjahcwr5R3KOGQzDM",
//   authDomain: "bird-c45f2.firebaseapp.com",
//   databaseURL: "https://bird-c45f2.firebaseio.com",
//   projectId: "bird-c45f2",
//   storageBucket: "bird-c45f2.appspot.com",
//   messagingSenderId: "687579025809",
//   appId: "1:687579025809:web:33036a6e9e2983f6da8a30"
// };
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// var ref = firebase.app().database().ref();
// ref.once('value')
//   .then(function (snap) {
//     console.log('snap.val()', snap.val());
//   });

app.use("/water", waterRoutes);

var port = 1337;
var server = app.listen(port, function () {
  console.log("Connected on port 1337");
})

var io = require('socket.io').listen(server);


io.on('connection', function (socket) {
  console.log('User connected, starting to record...');
  console.log("clients: " + Object.keys(io.sockets.sockets).length);

  var file = require('./ressources.json');
  console.log(file.water)
  io.emit("water", file.water)

  socket.on('live', function (msg) {
    console.log("Message: " + msg);
  });
  socket.on('disconnect', function () {
    console.log("clients: " + Object.keys(io.sockets.sockets).length);
  });
});

app.post('/bird', function (req, res) {
  if (req.body.presence == true) {
    io.emit('presence', true);
    console.log("here")
  }
  else {
    io.emit('presence', false);
    console.log("not here")

  }
  res.status(200).json({
    ok: "ok",
  });
});
