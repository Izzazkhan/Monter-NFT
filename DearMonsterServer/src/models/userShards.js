const mongoose = require('mongoose');

const UserShardSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    shardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CrystalShard',
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
}, {timestamps: true});


module.exports = mongoose.model('UserShard', UserShardSchema);