const mongoose = require('mongoose');

const ShardTypeSchema = new mongoose.Schema({
    typeName: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
}, {timestamps: true});


module.exports = mongoose.model('ShardType', ShardTypeSchema);