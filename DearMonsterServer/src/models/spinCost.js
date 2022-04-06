const mongoose = require('mongoose');

const SpinCostSchema = new mongoose.Schema({
    spin_1_cost: {
        type: Number
    },
    spin_5_cost: {
        type: Number
    },
    spin_25_cost: {
        type: Number
    },
    spin_100_cost: {
        type: Number
    }
}, {timestamps: true});


module.exports = mongoose.model('SpinCost', SpinCostSchema);