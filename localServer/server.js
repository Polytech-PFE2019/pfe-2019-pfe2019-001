var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var waitUntil = require('wait-until');
var cors = require('cors');
var functions = require('./functions')
var firebase = require("./firebase.js");
const fs = require('fs');


const waterRoutes = require("./routes/waterControl");
const foodRoutes = require("./routes/foodControl");

global.mail = "";
global.name = "";

console.log(process.env.PORT);
console.log(process.env.CAMSERVER);
console.log(process.env.SERVER);
console.log(process.env.CAMPORT);

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/water", waterRoutes);
app.use("/food", foodRoutes);

var port = process.env.PORT;
var server = app.listen(port, function () {
  console.log("Connected on port " + process.env.PORT);
})

var io = require('socket.io').listen(server);
exports.io = io;


var ref = firebase.database().ref();
var birdsCountRef = ref.child('users');
ref.once('value')
  .then(function (snap) {
    console.log("num : " + snap.numChildren())
    if (snap.numChildren() >= 2) {
      global.name = snap.child("users/nom").val();
      global.mail = snap.child("users/email").val();
      console.log(global.name + global.mail);
    }
  });
/*
var ref = firebase.database().ref('stats/birds_count');
ref.once('value', function (snap) {
    snap.forEach(function (childSnap) {
        var temp = new Date(childSnap.child("/time").val());
        var now = new Date(Date.now());
        if(temp.getDay() == now.getDay() 
            && temp.getMonth() == now.getMonth() 
            && temp.getFullYear() ==now.getFullYear()){
            var ref = firebase.database().ref();
            var countsRef = ref.child('stats/birds_count/'+childSnap.key);
            var countRef = countsRef.update({
              time: childSnap.child("/time").val(), value: (childSnap.child("/value").val()+10)
            });

        }else{
            var ref = firebase.database().ref();
            var birdsCountRef = ref.child('stats/birds_count');
            var birdsCountObj = {
                time: Date.now(),
                value: 10
            };
            birdsCountRef.push(birdsCountObj);
        }
    });

});
*/

// var ref = firebase.database().ref();
// var birdsCountRef = ref.child('stats/birds_count');
// var birdsCountObj = {
//   time: Date.now(),
//   value: Math.floor(Math.random() * 10)
// };
// birdsCountRef.push(birdsCountObj);


io.on('connection', function (socket) {
  console.log('User connected, starting to record...');
  console.log("clients: " + Object.keys(io.sockets.sockets).length);

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

//lancement automatique de la détection de mouvement
functions.motionDetection();

app.post('/bird', function (req, res) {
  console.log(req.body.presence)
  var file = require('./ressources/ressources.json');
  file.presence = req.body.presence;
  fs.writeFileSync('./ressources/ressources.json', JSON.stringify(file));
  if (req.body.presence == true) {
    io.emit('presence', true);
    functions.count();
    var intervalId = setInterval(functions.count, 300000);
  }
  else {
    io.emit('presence', false);
    clearInterval(intervalId);
  }
  res.status(200).json({
    ok: "ok",
  });
});