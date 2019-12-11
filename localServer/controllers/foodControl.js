const fs = require('fs');
const server = require('../server')
var nodemailer = require('nodemailer');


const path = require('path');
const { spawn } = require('child_process');

var iterations = 50;

function runScript() {
    return spawn('python', [
        path.join(__dirname, '/../scripts/food_control.py'),
        "--etalon-frame", "./ressources/etalon.jpg",
        //"--image", image
    ]);
}

// La requéte contient le channel image de la socket
async function setValue(req, res) {
    //console.log(req.body.food)
    var socket = require('socket.io-client')(`http://${process.env.CAMSERVER}:${process.env.CAMPORT}`);
    var file = require('./../ressources/ressources.json');
    //ip de la rasp : 192.168.43.77


    var score = 0
    nb_of_frames = 0

    // tentative de récupération des images avec des sockets
    // socket.on('image', (image) => {
    //     if (nb_of_frames < 50) {
    //         const subprocess = runScript(image);
    //         subprocess.stdout.on('data', (data) => {
    //             const text = data;
    //             console.log(text);
    //             score += parseInt(text, 10);
    //         });
    //         nb_of_frames += 1;
    //     }
    //     else if (nb_of_frames == 50) {

    //         score = score / nb_of_frames
    //         console.log(score);
    //         if (score > 0.2) {
    //             file.food = true;
    //         } else {
    //             file.food = false;
    //         }
    //         socket.removeAllListeners('image');
    //         socket.disconnect();
    //     }
    // });


    // var image;
    // // Création d'une requête HTTP
    // const request = require('request');
    // request("http://192.168.43.77:3000/picture", function (error, response, body) {
    //     console.log('error:', error);
    //     //console.log('statusCode:', response && response.statusCode);
    //     //console.log('body:', body);
    //     image = body;
    // });
    const subprocess = runScript();
    subprocess.stderr.on('data', (data) => {
        console.log("script for food detection launched");
        const text = data;
        console.log(data);
        score += parseInt(text, 10);
        if (score > 0.2) {
            file.food = true;
        } else {
            file.food = false;
        }
        fs.writeFileSync('./ressources/ressources.json', JSON.stringify(file));
        socket.emit('food', file.food);
        console.log(score);

    });

    console.log("food score computation finished");

    // await fs.writeFileSync('ressources.json', JSON.stringify(file));
    // socket.emit('food', file.food);
    // console.log(score);



    // server.io.emit('food', file.food);

    res.status(200).json({
        message: "Message received",
    });
}; module.exports.setValue = setValue;

async function setEtalon(req, res) {
    console.log("update etalon begin");
    var socket = require('socket.io-client')(`http://${process.env.CAMSERVER}:${process.env.CAMPORT}`);
    socket.emit('picture', 0, (image) => {
        console.log("update etalon in process");
        var ressourcespath = path.join(__dirname, "/../ressources/etalon.jpg");
        fs.writeFile(ressourcespath, image, 'base64', function (err) { });
        console.log("update etalon done");
        socket.disconnect();
    });

    res.status(200).json({
        message: "Message received",
    });
}; module.exports.setEtalon = setEtalon;
