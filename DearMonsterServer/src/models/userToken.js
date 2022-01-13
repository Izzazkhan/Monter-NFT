const mongoose = require('mongoose')


const TradeItemSchema = new mongoose.Schema({
    monsterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Monster',
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