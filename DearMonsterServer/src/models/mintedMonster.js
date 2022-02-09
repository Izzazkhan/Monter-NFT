const mongoose = require('mongoose')


const MintedMonsterSchema = new mongoose.Schema({
    monsterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Monster',
        required: true
    },
    scholarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scholarship',
    },
    owner: {
        type: String,
        required: true
    },
    tokenId: {
        type: Number,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        required: true
    },
    values: {
        UpdateTime: {
            type: String,
        },
        Level: {
            type: String,
        },
        EXP: {
            type: String,
        },
        Element: {
            type: String,
        },
        Energy: {
            type: String,
        }
    }
}, { timestamps: true })


module.exports = mongoose.model('MintedMonster', MintedMonsterSchema)