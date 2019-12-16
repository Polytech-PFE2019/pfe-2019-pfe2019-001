const fs = require('fs');
const fsPromises = fs.promises;
const server = require('../server')
var nodemailer = require('nodemailer');


const path = require('path');
const { spawn } = require('child_process');


function runScript() {
    return spawn('cd scripts && python3', [
        path.join(__dirname, '/../scripts/imageDifference.py'),
        //"-e", "./../ressources/etalon.jpg",
        //"--image", image
    ]);
}

// La requéte contient le channel image de la socket
async function setValue(req, res) {
    //console.log(req.body.food)
    //ip de la rasp : 192.168.43.175


    var score = 0
    nb_of_frames = 0

    var subprocess = spawn(`cd scripts && python3 imageDifference.py`,
        { shell: true }
    );
    console.log("script for food detection launched");
    subprocess.stdout.on('data', (data) => {
        console.log("" + data);
        score = parseFloat(data);
        // if (score > 0.2) {
        //     file.food = true;
        // } else {
        //     file.food = false;
        // }
        // fs.writeFileSync('./ressources/ressources.json', JSON.stringify(file));
        // socket.emit('food', file.food);
        console.log(score);
        console.log("food score computation finished");
        res.status(200).json({
            message: "Message received",
        });
    });
    subprocess.stderr.on('data', (data) => {
        console.log("" + data);
    });


    // await fs.writeFileSync('ressources.json', JSON.stringify(file));
    // socket.emit('food', file.food);
    // console.log(score);



    // server.io.emit('food', file.food);
}; module.exports.setValue = setValue;

async function setEtalon(req, res) {
    console.log("update etalon begin");
    var subprocess = spawn(`cd scripts && python3 video_receiver.py ../ressources etalon 1`,
        { shell: true }
    );
    subprocess.stderr.on('close', () => {
      console.log('Etalon updated');
      res.status(200).json({
          message: "Message received",
      });
    });
}; module.exports.setEtalon = setEtalon;
