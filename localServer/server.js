var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var waitUntil = require('wait-until');
var cors = require('cors');
var functions = require('./functions')
var firebase = require("./firebase.js");
const fs = require('fs');
const path = require('path');
var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const { spawn } = require('child_process');
var rimraf = require("rimraf");


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

/*var ref = firebase.database().ref();
var foodRef = ref.child('stats/food');
var foodObj = {
  time: Date.now(),
  value: false
};
var foodObj2 = {
  time: Date.now(),
  value: true
};
foodRef.push(foodObj);
foodRef.push(foodObj2);*/

io.on('connection', function (socket) {
  console.log('User connected, starting to record...');
  console.log("clients: " + Object.keys(io.sockets.sockets).length);

  var water;
  var temp;
  var waterStatsRef = ref.child('/stats/water');
  waterStatsRef.orderByKey().limitToLast(1).once('value', function (snap) {
    temp = snap.val()
    water = temp[Object.keys(temp)[0]].value;
  })

  io.emit("water", water)

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


// ==================================================================
var recording = false;
app.post('/video', function (req, res) {
  if (recording) {
    res.status(200).json({ error: "Already recording." });
    return;
  }
  var command = ffmpeg();
  recording = true;
  console.log("requetes lancée");
  var subprocess = spawn(`cd scripts && python3 video_receiver.py ../ressources/tmp-images image 50`,
    { shell: true }
  );
  subprocess.stderr.on('close', () => {
    console.log('Data gathered, creating video ...');
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();
    var secs = today.getSeconds();
    var timestamp = `${dd}-${mm}-${yyyy};${hh}:${min}:${secs}`;
    command
      .input('ressources/tmp-images/image%05d.jpg')
      .inputFPS(10)
      .output(`ressources/videos/${timestamp}.mp4`)
      .outputFPS(30)
      .noAudio()
      .on('progress', function (progress) {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('error', function (err) {
        console.log('Cannot process video: ' + err.message);
        recording = false;
        try {
          res.status(200).json({ error: "Cannot process video" });
        } catch(e) {
          console.log("error when sending response");
        }
      })
      .on('end', () => {
        console.log('Video generated.');
        const directory = './ressources/tmp-images/*';
        console.log('Deleting pictures...');
        rimraf(directory, function () {
          console.log('Pictures deleted.');
          subprocess.kill();
          recording = false;
          try {
            res.status(200).json({ ok: "ok" });
          } catch(e) {
            console.log("error when sending response");
          }
        });
      })
      .run();
  });
});
