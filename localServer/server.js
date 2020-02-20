var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var waitUntil = require('wait-until');
var cors = require('cors');
var functions = require('./functions')
const fs = require('fs');
var CronJob = require('cron').CronJob;
var foodControl = require('./controllers/foodControl');
const database = require('./utils/database')
const statsController = require('./controllers/stats');

var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://' + process.env.CAMSERVER);

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
    let tmp = JSON.parse(message.toString());
    statsController.addStatMqtt('water', Date.now(), tmp.water);
  }
});

const { spawn } = require('child_process');
var rimraf = require("rimraf");
var app2 = require('./webServer')

const foodRoutes = require("./routes/foodControl");
const imageRoutes = require("./routes/image");
const statsRoutes = require("./routes/stats");
const userRoutes = require("./routes/user");


global.mail = "";
global.name = "";

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/food", foodRoutes);
app.use("/image", imageRoutes);
app.use("/stats", statsRoutes);
app.use("/user", userRoutes);

var server = app.listen(process.env.PORT, function () {
  console.log("Connected on port " + process.env.PORT);
})

app2.listen(process.env.WEBPORT, function () {
  console.log("Connected on port " + process.env.WEBPORT);
})

var io = require('socket.io').listen(server);
exports.io = io;

io.on('connection', function (socket) {
  console.log('New user connected');
  console.log("clients: " + Object.keys(io.sockets.sockets).length);

  console.log('Fetching latest water value...');
  statsController.getLast('water').then(stats => {
    console.log('Sending latest water value to client');
    io.emit("water", stats.state);
  }).catch(err => {
    console.log("Error while fetching/sending water value");
  })

  console.log('Fetching latest food value...');
  statsController.getLast('food').then(stats => {
    console.log('Sending latest food value to client');
    io.emit("food", stats.state);
  }).catch(err => {
    console.log("Error while fetching/sending food value");
  })

  socket.on('disconnect', function () {
    console.log("clients: " + Object.keys(io.sockets.sockets).length);
  });
});

//lancement automatique de la détection de mouvement
functions.motionDetection();

const job = new CronJob('00 00 11 * * *', function () {
  if (fs.existsSync('./ressources/etalon00000.jpg')) {
    console.log('Checking the food.');
    foodControl.setValue();
  } else {
    console.log('No etalon set, can\'t check the food');
  }
});
console.log('After job instantiation');
job.start();
