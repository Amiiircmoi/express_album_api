const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    album: {
        type: Schema.Types.ObjectId,
        ref: 'Album',
        required: true
    }
});

module.exports = mongoose.model('Photo', PhotoSchema);
