const mongoose = require('mongoose');

const UserShardSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    shardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shard',
        required: true
    },
    count: {
        type: Number,
        required: true
    }
}, {timestamps: true});


module.exports = mongoose.model('UserShard', UserShardSchema);