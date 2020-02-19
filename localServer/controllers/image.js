const Album = require('../models/image')
const fs = require('fs');

exports.addImage = (req, res) => {
    let now = Date.now();
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

exports.addVideo = (name) => {
    let albumName = "new";
    name = name.trim() + ".mp4";
    let video = { path: "./ressources/videos/" + name, name: name }
    Album.findOneAndUpdate({ name: albumName }, { $push: { images: [video] } }, { upsert: true, new: true }, (err, doc) => {
        if (err) return err;
        console.log("Video added to database.");
        return 0;
    });
}

exports.getAlbums = (req, res) => {
    Album.find({}, function (err, albums) {
        var albumMap = [];
        albums.forEach((album) => {
            if (album.images[0] != undefined) {
                let thumbnail = fs.readFileSync(album.images[0].path, "utf8")
                albumMap.push({ thumbnail: thumbnail, album: album });
            }
        });
        res.send(albumMap);
    });
}

exports.moveImage = (req, res) => {
    console.log(req.body);
    Album.findOneAndUpdate({ name: req.body.oldAlbum }, { $pull: { images: { "path": req.body.image.path } } }, function (err, doc) {
        if (err) return res.status(500).send(err);
        if (doc.images.length == 1) {
            doc.remove();
        }
        Album.findOneAndUpdate({ name: req.body.newAlbum }, { $push: { images: req.body.image } }, { upsert: true, new: true }, (err, doc) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(doc);
        });
    })
}

exports.deleteImage = (req, res) => {
    console.log(req.body);

    Album.findOneAndUpdate({ name: req.body.name }, { $pull: { images: { "path": req.body.image } } }, function (err, doc) {
        if (err) return res.status(500).send(err);
        if (doc.images.length == 1) {
            doc.remove();
        }
        return res.status(200).send(doc);
    })
}

exports.getImgInAlbums = (req, res) => {
    Album.findOne({ name: req.params.name }, function (err, album) {
        if (err) return res.status(500).send(err);
        var imageMap = [];
        for (let e of album.images) {
            if (e.path.endsWith('.mp4')) {
                console.log(e.name);
                imageMap.push({ checked: false, img: e.name, path: e.path })
            } else {
                let b64 = fs.readFileSync(e.path, "utf8");
                imageMap.push({ checked: false, img: b64, path: e.path });
            }
        }
        res.send(imageMap);
    });
}

exports.getVideo = (req, res) => {
    const path = './ressources/videos/' + req.params.name
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1

        if (start >= fileSize) {
            res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
            return
        }

        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
}
