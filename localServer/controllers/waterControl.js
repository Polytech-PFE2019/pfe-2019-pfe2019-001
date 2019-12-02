const fs = require('fs');
const server = require('../server')
var nodemailer = require('nodemailer');
var firebase = require("firebase");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'birdcontrol06@gmail.com',
        pass: 'Birdcontrol06!'
    }
});

var mailOptions = {
    from: 'birdcontrol06@gmail.com',
    to: mail,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!' + name
};

async function setValue(req, res) {
    console.log(req.body.water)
    var file = require('./../ressources.json');
    file.water = req.body.water;
    await fs.writeFileSync('ressources.json', JSON.stringify(file));
    server.io.emit('water', req.body.water);
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.status(200).json({
        message: "Message received",
    });
}; module.exports.setValue = setValue;
