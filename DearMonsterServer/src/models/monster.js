const mongoose = require('mongoose');

const MonsterSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: 'monster name is required'
    },
    img: {
        type: String,
        required: 'monster img is required'
    },
    rating: {
        type: String,
        required: 'monster rating is required'
    },
    totalRating: {
        type: String,
        required: 'monster totalRating is required'
    },
    cetagory: {
        type: String,
        required: 'monster category is required'
    },
}, {timestamps: true});


module.exports = mongoose.model('Monster', MonsterSchema);