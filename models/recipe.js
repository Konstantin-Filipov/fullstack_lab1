const mongoose = require('mongoose');
const Joi = require("joi");

// Album Schema
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
    description: {
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
    }
});

// Album Model
const Recipe = mongoose.model('Recipes', recipeSchema);

// Validate 
function validateRecipe(Recipe) {
    const schema = Joi.object({
        _id: Joi.number().min(0).required(),
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(3).max(50).required(),
        ingridients: Joi.string().min(3).max(50).required()
    });
    return schema.validate(title);
}

exports.Recipe = Recipe;
exports.validate = validateRecipe;