const mongoose = require('mongoose');

const SpinCostSchema = new mongoose.Schema({
    spin_1_cost: {
        type: Number
    },
    spin_5_cost: {
        type: Number
    }
}, {timestamps: true});


module.exports = mongoose.model('SpinCost', SpinCostSchema);