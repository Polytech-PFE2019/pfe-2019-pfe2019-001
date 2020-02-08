const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const statSchema = new Schema({
    type: { type: String },
    date: { type: Number },
    state: { type: Boolean }

});

module.exports = mongoose.model('Stat', statSchema);