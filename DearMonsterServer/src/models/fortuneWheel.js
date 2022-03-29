const mongoose = require('mongoose');

const FortuneWheelSchema = new mongoose.Schema({
    wheelName: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    slots: [
        {
            option: {
                type: String,
                required: true
            },
            actionType: {
                type: String,    // Shard, BUSD, DMS, Free Spins
                required: true
            },
            shardType: {
                type: String,   // not required, will be used if the actionType is Shard, id of shard type will be here
            },
            value: {
                type: String,
                required: true
            },
            probability: {
                type: Number,
                required: true
            }
        }
    ]
}, {timestamps: true});


module.exports = mongoose.model('FortuneWheel', FortuneWheelSchema);