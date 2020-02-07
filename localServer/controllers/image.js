const Album = require('../models/image')
const fs = require('fs');

exports.addImage = (req, res) => {
    let now = new Date();
    let image = { path: "./ressources/" + now.toString() + '.jpg', name: now.toString() };
    let name = "new";
    if (req.body.name != undefined) {
        name = req.body.name;
    }
    Album.findOneAndUpdate({ name: name }, { $push: { images: [image] } }, { upsert: true, new: true }, (err, doc) => {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
    });
    fs.writeFileSync('./ressources/' + image.name + '.jpg', req.body.b64);
}

exports.getAlbums = (req, res) => {
    Album.find({}, function (err, albums) {
        var albumMap = [];
        let temp = {};
        albums.forEach((album) => {
            temp.thumbnail = fs.readFileSync(album.images[0].path, "utf8")
            temp.album = album;
            console.log(temp);
            albumMap.push(temp);
        });
        res.send(albumMap);
    });
}

exports.getImgInAlbums = (req, res) => {
    Album.findOne({ name: req.params.name }, function (err, album) {
        let b64;
        var imageMap = [];
        let temp = {};
        for (let e of album.images) {
            temp.checked = false;
            b64 = fs.readFileSync(e.path, "utf8")
            temp.img = b64;
            imageMap.push(temp);
        }
        res.send(imageMap);
    });
}