const fs = require('fs');
const server = require('../server')
var nodemailer = require('nodemailer');
var firebase = require("firebase");

// Test command line: curl -X POST --data '{"water":true}' -H "content-Type: application/json" http://localhost:1337/water
async function setValue(req, res) {

    var credentialsError = false;

    if (global.mail == undefined || global.name == undefined) {
        console.log("not ok")
        credentialsError = true;
    }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'birdcontrol06@gmail.com',
            pass: 'Birdcontrol06!'
        }
    });

    var mailOptions = {
        from: 'birdcontrol06@gmail.com',
        to: global.mail,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!' + global.name
    };

    console.log("Test : " + req.body.water);
    try {
      var ref = firebase.database().ref();
      var waterRef = ref.child('stats/water');
      var waterObj = {
        time: Date.now(),
        value: req.body.water
      };
      waterRef.push(waterObj);
      console.log("Water value added to database.")
    } catch(e) {
      console.log("Couldn't add water value to database.");
    }

    var file = require('./../ressources/ressources.json');
    file.water = req.body.water;
    await fs.writeFileSync('ressources.json', JSON.stringify(file));
    server.io.emit('water', req.body.water);
    if (!credentialsError) {
        server.io.emit("errorCred", false);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } else {
        server.io.emit("errorCred", true);
        console.log("pb de credentials !");
    }

    res.status(200).json({
        message: "Message received",
    });
}; module.exports.setValue = setValue;
