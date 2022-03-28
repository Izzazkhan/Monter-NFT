const mongoose = require('mongoose');

const BUSDRequestSchema = new mongoose.Schema({
    requesterAddress: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    type: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('BUSDRequest', BUSDRequestSchema);