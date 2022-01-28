const mongoose = require('mongoose');

const LevelBonusSchema = new mongoose.Schema({
    1: {
        type: Number,
        required: true,
    },
    2: {
        type: Number,
        required: true,
    },
    3: {
        type: Number,
        required: true,
    },
    4: {
        type: Number,
        required: true,
    },
    5: {
        type: Number,
        required: true,
    },
    6: {
        type: Number,
        required: true,
    }
}, {timestamps: true});


module.exports = mongoose.model('LevelBonus', LevelBonusSchema);