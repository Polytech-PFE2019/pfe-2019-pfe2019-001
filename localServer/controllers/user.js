const User = require('../models/user')

exports.setEmail = (req, res) => {
    User.findOneAndUpdate(null, { email: req.body.email }, { upsert: true, new: true }, (err, doc) => {
        if (err) return res.status(500).send(err);
        return res.send('Succesfully saved.');
    });
}

exports.getEmail = (req, res) => {
    User.findOne(null, (err, user) => {
        if (err) return res.status(500).send(err);
        res.send(user)
    })
}

