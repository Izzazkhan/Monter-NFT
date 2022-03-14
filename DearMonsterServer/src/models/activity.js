const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    type: {
        type: String,
    },
    activityDetails: {
        mintedMonsterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MintedMonster',
        },
        minionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Minion',
        },
        tradeItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TradeItem',
        },
        fightDetails: {
            fightStatus: {
                type: String,
            },
            rewards: {
                type: Number
            },
            type: {
                type: String
            }

        }
    }
}, {timestamps: true});


module.exports = mongoose.model('Activity', ActivitySchema);