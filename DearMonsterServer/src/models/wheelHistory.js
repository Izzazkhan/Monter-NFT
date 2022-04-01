const mongoose = require('mongoose');

const WheelHistorySchema = new mongoose.Schema({
    requesterAddress: {
        type: String,
        required: true
    },
    actionType: {
        type: String,
        required: true
    },
    shardType: {
        type: String,   
    },
    value: {
        type: String,
        required: true
    },
    probability: {
        type: Number,
        required: true
    }
}, {timestamps: true});


module.exports = mongoose.model('WheelHistory', WheelHistorySchema);