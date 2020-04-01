const Stat = require('../models/stats')
const fs = require('fs');
const server = require('../server')
var nodemailer = require('nodemailer');
const imageController = require("../controllers/image");
const { spawn } = require('child_process');
const userController = require('./user');

let recording = false;

exports.addStat = (req, res) => {
    let stat = new Stat()
    stat.type = req.body.type;
    stat.date = req.body.date;
    stat.state = req.body.state;
    if (stat.type == "bird") {
        server.io.emit('presence', stat.state);
        // ==================================================================
        if (!recording && stat.state) {
            recording = true;
            let video_name = undefined;
            console.log("Starting to record ...");
            var subprocess = spawn(`cd scripts && python3 video_maker.py ../ressources/videos 60`,
                { shell: true }
            );
            subprocess.stdout.on('data', (data) => {
                video_name = data.toString();
            });
            subprocess.stderr.on('close', () => {
                console.log('Video created ...');
                recording = false;
                if (video_name) imageController.addVideo(video_name);
            });
        }
    } else if (stat.type == "food") {
        server.io.emit('food', stat.state);
        if (!stat.state) {
            sendMail('Pénurie de nourriture', "La cabane n'a plus de nourriture et doit être remplie à nouveau.");
        }
    }
    stat.save((err, stat) => {
        if (err) res.status(500).send(err);
        res.send(stat);
    });
}

exports.addStatMqtt = (type, date, state) => {
    let stat = new Stat()
    stat.type = type;
    stat.date = date;
    stat.state = state;
    if (type == "water") {
        server.io.emit('water', state);
        if (!state) {
            sendMail("Pénurie d'eau", "La cabane n'a plus d'eau et doit être remplie à nouveau.");
        }
    }
    stat.save((err, stat) => {
        if (err) console.log(err);
        console.log('Value added to database');
    });
}

exports.getStats = (req, res) => {
    let d = new Date(req.query.year, req.query.month, req.query.day);
    let temp = d.getTime();

    Stat.find({ type: "bird" }, (err, stats) => {
        let result = [];
        stats.forEach((stat) => {
            if (stat.date >= temp) {
                result.push(stat);
            }
        });
        res.send(result)
    });
}

exports.getAverage = (req, res) => {
    Stat.find({ type: req.params.type }, function (err, stats) {
        let cpt = 0;
        stats = stats.sort(function (a, b) { return a.date - b.date });
        let temp1 = stats.filter((a) => {
            return a.state == false
        });

        let temp2 = stats.filter((a) => {
            return a.state == true
        });
        while (temp2.length != temp1.length) {
            if (temp2.length > temp1.length) {
                temp2.pop();
            } else if (temp1.length > temp2.length) {
                temp1.pop();
            }
        }
        if (temp2.length == 0) return res.send({ avg: 0 });
        function myFunction(value, index, array) {
            return temp2[index].date - value.date;
        }
        results = temp1.map(myFunction);
        results.forEach((res) => {
            cpt = cpt + res
        });
        res.send({ avg: cpt / temp1.length })
    });
}

exports.getLast = (type) => {
    return new Promise((resolve, reject) => {
        Stat.findOne({ type: type }).sort({ _id: -1 }).exec((err, stats) => {
            if (err) reject(err);
            resolve(stats);
        });
    })

}

function sendMail(object, content) {
    userController.getEmailLocal().then(user => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'birdcontrol06@gmail.com',
                pass: 'Birdcontrol06!'
            }
        });

        var mailOptions = {
            from: 'birdcontrol06@gmail.com',
            to: user.email,
            subject: object,
            text: content
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
}
