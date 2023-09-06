const mongoose = require('mongoose');
const Joi = require("joi");

// Album Schema
const albumSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        min: 0
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    artist: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    year: {
        type: Number,
        required: true,
        min: 0
    }
});

// Album Model
const Album = mongoose.model('Album', albumSchema);

// Validate 
function validateAlbum(Album) {
    const schema = Joi.object({
        _id: Joi.number().min(0).required(),
        name: Joi.string().min(3).max(50).required(),
        artist: Joi.string().min(3).max(50).required(),
        year: Joi.number().min(0).required()
    });
    return schema.validate(Album);
}

exports.Album = Album;
exports.validate = validateAlbum;