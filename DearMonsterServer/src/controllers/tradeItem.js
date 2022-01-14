const TradeItem = require('../models/tradeItem');

exports.index = async function (req, res) {
    const tradeItem = await TradeItem.find({ onSale: true });
    res.status(200).json({tradeItem, message: "item retrived successfully"});
};


exports.store = async (req, res) => {
    try {
        const { monsterId } = req.body;
        
        // monsterId, seller, price
        // Must uncomment for verification
        const tradeItem = await TradeItem.findOne({monsterId, onSale: true});
        if (tradeItem) return res.status(401).json({message: 'TradeItem already on sale.'});

        const newTradeItem = new TradeItem({...req.body});
        const tradeItem_ = await newTradeItem.save();
        
        res.status(200).json({message: 'Trade item created successfully', tradeItem: tradeItem_});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;
        const tradeItem = await TradeItem.aggregate([
            {
                $match: {  _id : id }
            },
            {
                $lookup: {
                    from: 'Monster',
                    foreignField: '_id',
                    localField: 'monsterId',
                    as: 'monster'
                }
            },
            {
                $unwind: '$monster'
            }
        ]);

        if (!tradeItem) return res.status(401).json({message: 'TradeItem does not exist'});
        
        res.status(200).json({tradeItem});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.update = async function (req, res) {
    try {
        const { update, id } = req.body;
        // const userId = req.user._id;


        // Must uncomment for verification
        // if (userId.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        const tradeItem = await TradeItem.findByIdAndUpdate(id, {$set: update}, {new: true});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({tradeItem, message: 'tradeItem has been updated'});

        //Attempt to upload to cloudinary
        // const result = await uploader(req);
        // const minon_ = await Minion.findByIdAndUpdate(id, {$set: update}, {$set: {profileImage: result.url}}, {new: true});

        // if (!req.file) return res.status(200).json({user: user_, message: 'Minion has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        // const user_id = req.user._id;

        //Make sure the passed id is that of the logged in user

        // Must uncomment for verification
        // if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        await TradeItem.findByIdAndDelete(id);
        res.status(200).json({message: 'TradeItem has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};



















