const mongoose = require('mongoose');
const Joi = require("joi");

// Recipe Schema
const recipeSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    ingridients: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    instructions: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    cookingTime:{
        type: Number,
        required: true
    }
});

// Recipe Model
const Recipe = mongoose.model('Recipes', recipeSchema);

// Validate 
function validateRecipe(recipe) {
    const schema = Joi.object({
        _id: Joi.string().length(24).required(),
        title: Joi.string().min(3).max(50).required(),
        ingridients: Joi.string().min(3).max(50).required(),
        instructions: Joi.string().min(3).max(50).required(),
        cookingTime: Joi.number().required()
    });
    return schema.validate(recipe);
}

module.exports = {
    Recipe,
    validateRecipe
};