require('dotenv').config();

const albums = require('./routes/albums');
const home = require('./routes/home');
const mongoose = require("mongoose");
const express = require('express');
const app = express();

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {console.log("Connected to MongoDB");})
    .catch((err) => {console.error("Error connecting to MongoDB:", err);
    process.exit(1);});  


app.use(express.json());
app.use(express.static('front'));

app.use('/api/albums', albums);
app.use('/', home);

const PORT = process.env.PORT;
app.listen(PORT, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${PORT}`); 
});