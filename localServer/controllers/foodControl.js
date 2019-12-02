const fs = require('fs');
const server = require('../server')
var nodemailer = require('nodemailer');
// const socket = server.io.connect('http://192.168.43.77:3000');

const path = require('path');
const { spawn } = require('child_process');

var iterations = 50;

function runScript(image) {
    return spawn('python', [
        path.join(__dirname, 'food_detector.py'),
        "--etalon-frame", "./ressources/etalon.jpg",
        "--image", image
    ]);
}

// La requéte contient le channel image de la socket
async function setValue(req, res) {
    console.log(req.body.food)
    var file = require('./../ressources/ressources.json');

    // socket.emit('foodVideoStart', iterations);
    server.io.emit('foodVideoStart', iterations);

    var score = 0
    nb_of_frames = 0
    socket.on('foodVideoStart', (image) => {
        score += runScript(image)
        nb_of_frames += 1 
    });
    
    // socket.emit('foodVideoStop');
    server.io.emit('foodVideoStop');
    score = score / nb_of_frames
    console.log(score);

    if (score > 0.2) {
        file.food = true
    } else {
        file.food = false
    }


    await fs.writeFileSync('ressources.json', JSON.stringify(file));
    io.emit('food', file.food);

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
