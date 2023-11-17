const express = require('express');
const router = express.Router();
const { Album, validate } = require('../models/album')
const mongoose = require("mongoose");

// Get all the albums
router.get('/', async (req, res) => {
    const albums = await Album
        .find()
        .select({ _id: 1, title: 1, artist: 1 , year: 1});
    res.send(albums);
});

// Delete an album
router.delete('/:id', async (req, res) => {
    if (isNaN(req.params.id)) {
        return res.status(400).json({ error: 'Not a valid ID format.' });
    }

    const album = await Album.findOneAndRemove({ _id: req.params.id });
    
    if (!album) {
        return res.status(404).json({ error: 'No match for the ID.' });
    }

    res.status(200).json(album);
});

// Get a user
// Get a specific album by ID
router.get('/:id', async (req, res) => {
    const album = await Album.findById(req.params.id);

    if (!album) {
        return res.status(404).json({ error: 'No match for the ID.' });
    }

    res.status(200).json(album);
});

module.exports = router;