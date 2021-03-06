const fs = require('fs');
const server = require('../server')
var nodemailer = require('nodemailer');
var firebase = require("firebase");

async function setValue(message) {

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

    console.log("Test : " + message.water);
    try {
        var ref = firebase.database().ref();
        var waterRef = ref.child('stats/water');
        var waterObj = {
            time: Date.now(),
            value: message.water
        };
        waterRef.push(waterObj);
        console.log("Water value added to database.")
    } catch (e) {
        console.log("Couldn't add water value to database.");
    }

    var file = require('./../ressources/ressources.json');
    file.water = message.water;
    await fs.writeFileSync('./ressources/ressources.json', JSON.stringify(file));
    server.io.emit('water', message.water);
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
    
}; module.exports.setValue = setValue;
