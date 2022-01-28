const mongoose = require('mongoose');

const MinionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'minon name is required',
    },
    img: {
        type: String,
        unique: true,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    totalRating: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    values: {
        Win_Rate: {
            type: Number,
            required: true,
        },
        Reward_Estimated: {
            type: String,
            required: true,
        },
        Lose_Exp_Gain: {
            type: Number,
            required: true,
        },
        Exp_Gain: {
            type: Number,
            required: true,
        },
    }
}, {timestamps: true});


module.exports = mongoose.model('Minions', MinionSchema);