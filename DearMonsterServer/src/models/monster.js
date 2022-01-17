const mongoose = require('mongoose');

const MonsterSchema = new mongoose.Schema({
    title: {
        type: String,
        // unique: true,
        required: 'monster name is required'
    },
    cetagory: {
        type: String,
        required: 'monster category is required'
    },
    img: {
        type: String,
        required: 'monster img is required',
        unique: true,
    },
    totalRating: {
        type: Number,
        required: 'monster totalRating is required'
    },
    price: {
        type: Number,
        required: 'monster price is required'
    }
}, {timestamps: true});


module.exports = mongoose.model('Monster', MonsterSchema);