const mongoose = require('mongoose');

const WithdrawRequestSchema = new mongoose.Schema({
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
    },
    transactionHash: {
        type: String,
    }
}, {timestamps: true});

module.exports = mongoose.model('WithdrawRequest', WithdrawRequestSchema);