var express = require("express");
var path = require("path");
var app = express();
var firebase = require("firebase");
const bodyParser = require("body-parser");
var cors = require('cors')


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var firebaseConfig = {
  apiKey: "AIzaSyCncb_SkW0LNdf2phmjahcwr5R3KOGQzDM",
  authDomain: "bird-c45f2.firebaseapp.com",
  databaseURL: "https://bird-c45f2.firebaseio.com",
  projectId: "bird-c45f2",
  storageBucket: "bird-c45f2.appspot.com",
  messagingSenderId: "687579025809",
  appId: "1:687579025809:web:33036a6e9e2983f6da8a30"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var ref = firebase.app().database().ref();
ref.once('value')
  .then(function (snap) {
    console.log('snap.val()', snap.val());
  });

app.post('/water', function (req, res) {
  console.log(req.body.key)
  var usersRef = ref.child('users');
  // Create a new ref and log it’s push key
  var userRef = usersRef.push();
  console.log('user key', userRef.key);
  // Create a new ref and save data to it in one step
  var userRef = usersRef.push({
    name: 'water',
    empty: true
  });
  res.status(200).json({
    message: "Message received",
  });
});

app.get('/water', function (req, res) {
  res.status(200).json({
    water: false,
  });
});



var port = 1337;
app.listen(port, function () {
  console.log("Connected on port 1337");
})