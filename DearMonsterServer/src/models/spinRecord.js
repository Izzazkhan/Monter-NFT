const mongoose = require('mongoose');

const SpinRecordSchema = new mongoose.Schema({
    userId: {
        type: String,
        // required: true,
    },
    no_of_spin: {
        type: Number,
        // required: true
    },
    type: {
        type: String,
        // required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('SpinRecord', SpinRecordSchema);
