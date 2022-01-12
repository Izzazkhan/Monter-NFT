const mongoose = require('mongoose');

const MinionSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: 'minon name is required',
    },
    img: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    totalRating: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    values: {
        Win_Rate: {
            type: String,
            required: true,
        },
        Reward_Estimated: {
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


// {
//     id: '#123212',
//     title: 'Monster A',
//     img: '/assets/gif/4 Monster characters (1)/1. Monster animated.gif',
//     rating: '2',
//     totalRating: 3,
//     values: {
//         Win_Rate: '~70%',
//         Reward_Estimated: 'None',
//         Exp_Gain: 'A34500',
//     },
//     price: '3,000',
// },