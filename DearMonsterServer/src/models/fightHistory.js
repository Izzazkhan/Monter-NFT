const mongoose = require('mongoose');

const FightHistorySchema = new mongoose.Schema({
    monsterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Monster',
        required: true
    },
    minionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Minions',
        required: true
    },
    type: {
        type: String
    },
    fightStatus: {
        type: String
    },
    // rating: {
    //     type: Number
    // }
    
}, {timestamps: true});


module.exports = mongoose.model('FightHistory', FightHistorySchema);