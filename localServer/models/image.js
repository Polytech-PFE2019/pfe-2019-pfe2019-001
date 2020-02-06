const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ImageSchema = new Schema({
    name: { type: String },
    path: { type: String }
});

module.exports = mongoose.model('Image', ImageSchema);