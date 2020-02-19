const User = require('../models/user')

exports.addEmail = (req, res) => {
    let user = new User();
    user.email = req.body.email;
    user.save((err, user) => {
        if (err) res.send(err);
        res.send(user);
    });
}

exports.setEmail = (req, res) => {
    User.findOne(null, (err, user) => {
        console.log(user);
        user.email = req.body.email;
        user.save((err, user) => {
            if (err) res.send(err);
            res.send(user);
        });

    })
}

exports.getEmail = (req, res) => {
    User.findOne(null, (err, user) => {
        if (err) return res.send(500, { error: err });
        res.send(user)
    })
}

