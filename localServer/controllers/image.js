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

exports.moveImage = (req, res) => {
    Album.update({ "name": req.body.oldAlbum }, { $pull: { "images": { "path": req.body.image.path } } }).then(
        Album.update({ "name": req.body.newAlbum }, { $push: { "images": req.body.image } }).then(
            res.send(200)
        ))
}

exports.getImgInAlbums = (req, res) => {
    Album.findOne({ name: req.params.name }, function (err, album) {
        var imageMap = [];
        for (let e of album.images) {
            let b64 = fs.readFileSync(e.path, "utf8");
            imageMap.push({ checked: false, img: b64, path: e.path });
        }
        res.send(imageMap);
    });
} 