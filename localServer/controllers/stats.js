const Stat = require('../models/stats')
const fs = require('fs');
const server = require('../server')
var nodemailer = require('nodemailer');

exports.addStat = (req, res) => {
    let stat = new Stat()
    stat.type = req.body.type;
    stat.date = req.body.date;
    stat.state = req.body.state;
    if (stat.type == "bird") {
      server.io.emit('presence', stat.state);
    }
    stat.save((err, stat) => {
        if (err) res.send(err);
        res.send(stat);
    });
}

exports.addStatMqtt = (type, date, state) => {
    let stat = new Stat()
    stat.type = type;
    stat.date = date;
    stat.state = state;
    if (type == "water") {
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

      server.io.emit('water', state);
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
