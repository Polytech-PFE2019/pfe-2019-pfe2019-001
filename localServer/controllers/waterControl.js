
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'birdcontrol06@gmail.com',
        pass: 'Birdcontrol06!'
    }
});

var mailOptions = {
    from: 'birdcontrol06@gmail.com',
    to: 'camille.leroux97@orange.fr',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

exports.setValue = (req, res) => {
    console.log(req.body.Empty)

    transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});

    res.status(200).json({
        message: "Message received",
    });
};

exports.getValue = (req, res) => {
    res.status(200).json({
        water: false,
    });
}