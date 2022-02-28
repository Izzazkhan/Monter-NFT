const mongoose = require('mongoose');

const ProbabiltyListSchema = new mongoose.Schema({
    prob_1: {
        type: Number,
        required: true,
    },
    prob_2: {
        type: Number,
        required: true,
    },
    prob_3: {
        type: Number,
        required: true,
    },
    prob_4: {
        type: Number,
        required: true,
    },
    prob_5: {
        type: Number,
        required: true,
    },
}, {timestamps: true});


module.exports = mongoose.model('ProbabiltyList', ProbabiltyListSchema);