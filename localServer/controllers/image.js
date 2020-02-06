const Album = require('../models/image')
const fs = require('fs');

exports.addImage = (req, res) => {
    let now = new Date();
    let image = { path: "./ressources/" + now.toString() + '.jpg', name: now.toString() };
    Album.findOneAndUpdate({ name: "new" }, { $push: { images: [image] } }, { upsert: true, new: true }, (err, doc) => {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
    });
    fs.writeFileSync('./ressources/' + image.name + '.jpg', req.body.b64);
}

exports.getAlbums = (req, res) => {
    Album.find({}, function (err, images) {
        var imageMap = {};
        images.forEach(function (image) {
            imageMap[image.name] = image;
        });
        res.send(imageMap);
    });
}

exports.getImgInAlbums = (req, res) => {
    Album.findOne({ name: req.params.name }, function (err, album) {
        let b64;
        var imageMap = {};
        for (let e of album.images) {
            b64 = fs.readFileSync(e.path, "utf8")
            imageMap[e.name] = b64;
        }
        res.send(imageMap);
    });
}