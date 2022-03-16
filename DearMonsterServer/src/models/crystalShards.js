const mongoose = require('mongoose');

const CrystalShardSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    crystalImage: {
        type: String
    }
}, {timestamps: true});


module.exports = mongoose.model('CrystalShard', CrystalShardSchema);