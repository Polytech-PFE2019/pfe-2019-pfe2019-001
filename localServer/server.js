var express = require("express");
var firebase = require("firebase");
var app = express();
const bodyParser = require("body-parser");
var waitUntil = require('wait-until');
var cors = require('cors');
var functions = require('./functions')
var schedule = require('node-schedule');


const waterRoutes = require("./routes/waterControl");
const foodRoutes = require("./routes/foodControl");

global.mail = "";
global.name = "";

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/water", waterRoutes);
app.use("/food", foodRoutes);

var firebaseConfig = {
  apiKey: "AIzaSyCncb_SkW0LNdf2phmjahcwr5R3KOGQzDM",
  authDomain: "bird-c45f2.firebaseapp.com",
  databaseURL: "https://bird-c45f2.firebaseio.com",
  projectId: "bird-c45f2",
  storageBucket: "bird-c45f2.appspot.com",
  messagingSenderId: "687579025809",
  appId: "1:687579025809:web:33036a6e9e2983f6da8a30"
};
firebase.initializeApp(firebaseConfig);

var ref = firebase.database().ref();
var usersRef = ref.child('users');
var userRef = usersRef.push();

schedule.scheduleJob('* */10 * * * *', function () {
  functions.count()
});


var io = require('socket.io').listen(server);
exports.io = io;


io.on('connection', function (socket) {
  console.log('User connected, starting to record...');
  console.log("clients: " + Object.keys(io.sockets.sockets).length);

  ref.once('value')
    .then(function (snap) {
      if (snap.numChildren() == 1) {
        global.name = snap.child("users/nom").val();
        global.mail = snap.child("users/email").val();
      }
    });

  var file = require('./ressources/ressources.json');
  io.emit("water", file.water)

  socket.on('live', function (msg) {
    console.log("Message: " + msg);
  });
  socket.on('disconnect', function () {
    console.log("clients: " + Object.keys(io.sockets.sockets).length);
  });

  socket.on('mail', function (msg) {
    console.log("Mail: " + msg);
    mail = msg;
  });

  socket.on('name', function (msg) {
    console.log("Name: " + msg);
    name = msg;

    waitUntil().interval(500)
      .times(10).condition(function () {
        return (name != "" && mail != "");
      })
      .done(function (result) {
        var ref = firebase.database().ref();
        console.log(name + " " + mail);
        ref.once('value')
          .then(function (snap) {
            console.log(snap.numChildren());
            if (snap.numChildren() >= 1) {
              console.log("update");
              var usersRef = ref.child('users');
              var userRef = usersRef.push();
              console.log('user key', userRef.key);
              var userRef = usersRef.update({
                nom: name, email: mail
              });
            } else {
              console.log("pas update");
              var usersRef = ref.child('users');
              var userRef = usersRef.push();
              console.log('user key', userRef.key);
              var userRef = usersRef.push({
                nom: name, email: mail
              });
            }
          });
      });

  });
});

app.post('/bird', function (req, res) {
  if (req.body.presence == true) {
    io.emit('presence', true);
  }
  else {
    io.emit('presence', false);
  }
  res.status(200).json({
    ok: "ok",
  });
});

var port = 1337;
var server = app.listen(port, function () {
  console.log("Connected on port 1337");
})