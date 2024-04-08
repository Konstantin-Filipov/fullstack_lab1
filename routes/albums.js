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

router.post('/', async (req, res) => {
    const { title, artist, year } = req.body;
    if (!title || !artist || !year) {
        return res.status(400).json({ error: 'Please provide title, artist, and year for the album.' });
    }
    try {
        // Create a new album instance
        const newAlbum = new Album({
            
            title: title,
            artist: artist,
            year: year
        });

        // Save the new album to the database
        const savedAlbum = await newAlbum.save();

        // Return the saved album in the response
        res.status(201).json(savedAlbum);
    } catch (error) {
        console.error('Error creating the album:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
module.exports = router;