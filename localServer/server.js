var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var waitUntil = require('wait-until');
var cors = require('cors');
var functions = require('./functions')
var firebase = require("./firebase.js");
const fs = require('fs');
var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
var CronJob = require('cron').CronJob;
var foodControl = require('./controllers/foodControl');
const database = require('./utils/database')


var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://' + process.env.CAMSERVER);
const waterController = require("./controllers/waterControl");

function initDatabaseMiddleWare() {
  if (process.platform === "win32") {
    require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    }).on("SIGINT", () => {
      console.log('SIGINT: Closing MongoDB connection');
      database.close();
    });
  }
  process.on('SIGINT', () => {
    console.log('SIGINT: Closing MongoDB connection');
    database.close();
  });

  database.open(() => { });
}

initDatabaseMiddleWare();


client.on('connect', () => {
  client.subscribe('sensor/water', (err) => {
    if (err) {
      console.log("Couldn't connect to the broker.");
    } else {
      console.log("Broker connection successful");
    }
  })
});

client.on('message', (topic, message) => {
  if (topic == "sensor/water") {
    console.log(message.toString());
    waterController.setValue(JSON.parse(message.toString()));
  }
});

const { spawn } = require('child_process');
var rimraf = require("rimraf");
var app2 = require('./webServer')

const foodRoutes = require("./routes/foodControl");
const imageRoutes = require("./routes/image");


global.mail = "";
global.name = "";

var videoCpt = 5;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/food", foodRoutes);
app.use("/img", imageRoutes);


var server = app.listen(process.env.PORT, function () {
  console.log("Connected on port " + process.env.PORT);
})

app2.listen(process.env.WEBPORT, function () {
  console.log("Connected on port " + process.env.WEBPORT);
})

var io = require('socket.io').listen(server);
exports.io = io;


var ref = firebase.database().ref();
ref.once('value')
  .then(function (snap) {
    console.log("num : " + snap.numChildren())
    if (snap.numChildren() >= 2) {
      global.name = snap.child("users/nom").val();
      global.mail = snap.child("users/email").val();
      console.log(global.name + global.mail);
    }
  });

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

const job = new CronJob('00 00 11 * * *', function () {
  videoCpt = 5;
  foodControl.setValue();
});
console.log('After job instantiation');
job.start();

var intervalId;
app.post('/bird', function (req, res) {
  console.log('Presence: ' + req.body.presence)
  var file = require('./ressources/ressources.json');
  file.presence = req.body.presence;
  fs.writeFileSync('./ressources/ressources.json', JSON.stringify(file));
  if (req.body.presence == true) {
    io.emit('presence', true);
    //functions.count();
    //video();
    //intervalId = setInterval(functions.count, 300000);
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
function video() {
  if (recording || videoCpt == 0) {
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
    var timestamp = today.toString();
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
      })
      .on('end', () => {
        console.log('Video generated.');
        videoCpt--;
        const directory = './ressources/tmp-images/*';
        console.log('Deleting pictures...');
        rimraf(directory, function () {
          console.log('Pictures deleted.');
          subprocess.kill();
          recording = false;
        });
      })
      .run();
  });
};
