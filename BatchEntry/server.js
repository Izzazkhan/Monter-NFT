const express = require("express");
const mongoose = require('mongoose');
const contract = require('./controllers/contractInteraction')
app = express(); // Initializing app


mongoose.promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/monsternft', { useNewUrlParser: true });

const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB --  database connection established successfully!'));
connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

contract.metaMaskConnection();


app.listen(4200, () => { console.log('Server is running') });