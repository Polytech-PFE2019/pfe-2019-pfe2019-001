const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const albumSchema = new Schema({
    name: { type: String },
    images: [{
        name: { type: String },
        path: { type: String }
    }],
});

module.exports = mongoose.model('Album', albumSchema);