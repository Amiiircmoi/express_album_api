const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    photos: [{
        type: Schema.Types.ObjectId,
        ref: 'Photo'
    }]
});

module.exports = mongoose.model('Album', AlbumSchema);
