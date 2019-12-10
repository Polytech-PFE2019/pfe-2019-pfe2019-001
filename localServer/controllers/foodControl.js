const fs = require('fs');
const server = require('../server')
var nodemailer = require('nodemailer');


const path = require('path');
const { spawn } = require('child_process');

var iterations = 50;

function runScript(image) {
    return spawn('python', [
        path.join(__dirname, '/../scripts/food_control.py'),
        "--etalon-frame", "./ressources/etalon.jpg",
        "--image", image
    ]);
}

// La requéte contient le channel image de la socket
async function setValue(req, res) {
    console.log(req.body.food)
    var socket = require('socket.io-client')('http://raspberrypi.local:3000');
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

    // Création d'une requête HTTP
    var req = new XMLHttpRequest();
    // Requête HTTP GET asynchrone vers le fichier langages.txt publié localement
    req.open("GET", "http://raspberrypi.local/picture");
    req.addEventListener("load", function () {
        // Affiche la réponse reçue pour la requête (ici un string de l'image en base64)
        console.log(req.responseText);
        score += parseInt(text, 10);
    });
    // Envoi de la requête
    req.send(null);


    await fs.writeFileSync('ressources.json', JSON.stringify(file));
    socket.emit('food', file.food);
    // server.io.emit('food', file.food);

    res.status(200).json({
        message: "Message received",
    });
}; module.exports.setValue = setValue;

async function setEtalon(req, res) {
    console.log("update etalon begin");
    var socket = require('socket.io-client')('http://raspberrypi.local:3000');
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
