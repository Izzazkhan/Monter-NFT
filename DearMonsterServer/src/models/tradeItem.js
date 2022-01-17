const mongoose = require('mongoose')


const TradeItemSchema = new mongoose.Schema({
    mintedMonsterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MintedMonster',
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    onSale: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })


module.exports = mongoose.model('TradeItem', TradeItemSchema)