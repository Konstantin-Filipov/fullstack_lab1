const express = require('express');
const router = express.Router();
const { Album, validate } = require('../models/album')
const mongoose = require("mongoose");

// Get all the users
router.get('/', async (req, res) => {
    const albums = await Album
        .find()
        .select({ _id: 1, title: 1, artist: 1 , year: 1});
    res.send(albums);
});

module.exports = router;