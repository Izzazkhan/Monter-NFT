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
    // values: {
    //     Level: {
    //         type: String,
    //     },
    //     EXP: {
    //         type: String,
    //     },
    //     Element: {
    //         type: String,
    //     },
    //     Energy: {
    //         type: String,
    //     }
    // }
}, {timestamps: true});


module.exports = mongoose.model('Monster', MonsterSchema);