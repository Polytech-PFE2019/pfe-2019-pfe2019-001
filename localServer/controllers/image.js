const Image = require('../models/image')
const fs = require('fs');

exports.addImage = (req, res) => {
    let now = new Date();
    let image = new Image();
    image.path = "./ressources/ok.jpg"
    image.name = now.toString();
    fs.writeFileSync('./ressources/' + image.name, req.body.b64);
    image.save((err, image) => {
        if (err) res.send(err);
        res.send(image);
    });
}

exports.getImages = (req, res) => {
    Image.find({}, function (err, images) {
        var imageMap = {};
        images.forEach(function (image) {
            imageMap[image.name] = image;
        });
        res.send(imageMap);
    });
}