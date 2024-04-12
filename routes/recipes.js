const express = require('express');
const router = express.Router();
const { Recipe, validate } = require('../models/recipe')
const mongoose = require("mongoose");

// Get all the recipes
router.get('/', async (req, res) => {
    const recipes = await Recipe
        .find()
        .select({ _id: 1, title: 1, description: 1 , ingridients: 1});
    res.send(recipes);
});

// Get a specific recipe by ID
router.get('/:id', async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return res.status(404).json({ error: 'No match for the ID.' });
    }

    res.status(200).json(recipe);
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
    console.log("Deleting recipe with ID:", req.params.id); // Log the ID

    const id = req.params.id;

    // Check if the id is a valid ObjectId format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
        return res.status(400).json({ error: 'Not a valid ID format.' });
    }

    const recipe = await Recipe.findOneAndRemove({ _id: req.params.id });
    
    if (!recipe) {
        return res.status(404).json({ error: 'No match for the ID.' });
    }

    res.status(200).json(recipe);
});


router.post('/', async (req, res) => {
    const { title, desciption, ingridients } = req.body;
    if (!title || !desciption || !ingridients) {
        return res.status(400).json({ error: 'Please provide title, desciption and ingridients for the recipe.' });
    }
    try {
        // Create a new album instance
        const newRecipe = new Recipe({
            
            title: title,
            description: description,
            ingridients: ingridients
        });

        // Save the new album to the database
        const saveRecipe = await newRecipe.save();

        // Return the saved album in the response
        res.status(201).json(saveRecipe);
    } catch (error) {
        console.error('Error creating the recipe:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
module.exports = router;