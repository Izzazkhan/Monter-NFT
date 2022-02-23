const mongoose = require('mongoose');

const UserEarningSchema = new mongoose.Schema({
    earnerAddress: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    lastClaim: {
        type: String,
    },
    isRequested: {
        type: Boolean,
        default: false
    },
    type: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('UserEarning', UserEarningSchema);