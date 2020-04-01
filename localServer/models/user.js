const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String }
});

module.exports = mongoose.model('User', userSchema);