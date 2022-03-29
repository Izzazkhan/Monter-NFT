const mongoose = require('mongoose');

const ShardSchema = new mongoose.Schema({
    shardName: {
        type: String
    },
    shardDescription: {
        type: String
    },
    shardTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShardType',
        required: true
    },
}, {timestamps: true});


module.exports = mongoose.model('Shard', ShardSchema);