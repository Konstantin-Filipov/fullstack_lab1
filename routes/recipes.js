const express = require('express');
const router = express.Router();
const { Recipe } = require('../models/recipe')
const mongoose = require('mongoose');

// Get all the recipes
router.get('/', async (req, res) => {
    const recipes = await Recipe
        .find()
        .select({ _id: 1, title: 1, ingridients: 1 , instructions: 1, cookingTime: 1});
    res.send(recipes);
});

// Get a specific recipe by title
router.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const recipe = await Recipe.findOne({ title });

        if (!recipe) {
            return res.status(404).json({ error: 'No match for the title.' });
        }

        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error retrieving recipe by title:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a recipe by id
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

//make post req with new entry
router.post('/', async (req, res) => {
    const { title, ingridients, instructions, cookingTime } = req.body;
    if (!title || !ingridients || !instructions || !cookingTime) {
        return res.status(400).json({ error: 'Please provide title, ingridients, instructions and cooking time for the recipe.' });
    }
    try {
        const _id = new mongoose.Types.ObjectId()
        // Create a new album instance
        const newRecipe = new Recipe({
            _id: _id,
            title: title,
            ingridients: ingridients,
            instructions: instructions,
            cookingTime: cookingTime
        });

        // Save the new album to the database
        const saveRecipe = await newRecipe.save();

        // Return the saved album in the response
        res.status(201).json(saveRecipe);
    } catch (error) {
        console.error('Error creating the recipe in post method:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// update a recipe by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, ingridients, instructions, cookingTime } = req.body;

    try {
        // Find the recipe by ID
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Update the recipe properties
        recipe.title = title;
        recipe.ingridients = ingridients;
        recipe.instructions = instructions;
        recipe.cookingTime = cookingTime;

        // Save the updated recipe
        await recipe.save();

        // Respond with the updated recipe
        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;