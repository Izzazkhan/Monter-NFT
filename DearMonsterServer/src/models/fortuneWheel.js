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
            probability: {
                type: Number,
                required: true
            }
        }
    ]
}, {timestamps: true});


module.exports = mongoose.model('FortuneWheel', FortuneWheelSchema);