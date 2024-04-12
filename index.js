require('dotenv').config();

const recipes = require('./routes/recipes');
const mongoose = require("mongoose");
const express = require('express');
const app = express();


mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {console.log("Connected to MongoDB");})
    .catch((err) => {console.error("Error connecting to MongoDB:", err);
    process.exit(1);});  
    
app.use(express.json());
app.use(express.static('front'));

app.use('/api/recipes', recipes);

//listen to port- {PORT}
const PORT = process.env.PORT;
app.listen(PORT, () => {console.log(`Now listening on port ${PORT}`);});