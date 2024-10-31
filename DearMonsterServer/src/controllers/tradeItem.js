const TradeItem = require('../models/tradeItem');
const MintedMonster = require('../models/mintedMonster');

exports.index = async function (req, res) {
    const tradeItem = await TradeItem.find({ onSale: true });
    res.status(200).json({ tradeItem, message: "item retrived successfully" });
};


exports.store = async (req, res) => {
    try {
        const { monsterId } = req.body;

        // monsterId, seller, price
        // Must uncomment for verification
        const tradeItem = await TradeItem.findOne({ mintedMonsterId: monsterId, onSale: true });
        if (tradeItem) return res.status(401).json({ message: 'TradeItem already on sale.' });

        const newTradeItem = new TradeItem({ ...req.body });
        const tradeItem_ = await newTradeItem.save();

        res.status(200).json({ message: 'Trade item created successfully', tradeItem: tradeItem_ });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;
        const tradeItem = await TradeItem.aggregate([
            {
                $match: { _id: id }
            },
            {
                $lookup: {
                    from: 'monsters',
                    foreignField: '_id',
                    localField: 'monsterId',
                    as: 'monster'
                }
            },
            {
                $unwind: '$monster'
            }
        ]);

        if (!tradeItem) return res.status(401).json({ message: 'TradeItem does not exist' });

        res.status(200).json({ tradeItem });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.update = async function (req, res) {
    try {
        const { update, id } = req.body;
        // const userId = req.user._id;


        // Must uncomment for verification
        // if (userId.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        const tradeItem = await TradeItem.findByIdAndUpdate(id, { $set: update }, { new: true });

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({ tradeItem, message: 'tradeItem has been updated' });

        //Attempt to upload to cloudinary
        // const result = await uploader(req);
        // const minon_ = await Minion.findByIdAndUpdate(id, {$set: update}, {$set: {profileImage: result.url}}, {new: true});

        // if (!req.file) return res.status(200).json({user: user_, message: 'Minion has been updated'});

    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(200).json({ message: 'TradeItem has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.inTradeItems = async function (req, res) {
    const seller = req.params.owner;
    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);
    const tradeItems = await TradeItem.aggregate([
        {
            $match: { seller }
        },
        {
            $lookup: {
                from: 'mintedmonsters',
                foreignField: '_id',
                localField: 'mintedMonsterId',
                as: 'mintedMonster'
            }
        },
        {
            $unwind: '$mintedMonster'
        },
        {
            $lookup: {
                from: 'monsters',
                foreignField: '_id',
                localField: 'mintedMonster.monsterId',
                as: 'monster'
            }
        },
        {
            $unwind: '$monster'
        },
    ]).skip(skip).limit(limit)
    const count = await TradeItem.find().countDocuments()
    res.status(200).json({ tradeItems, count, message: "Trade items retrived successfully" });
};



exports.allInTrade = async function (req, res) {

    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);

    const tradeItems = await TradeItem.aggregate([
        {
            $lookup: {
                from: 'mintedmonsters',
                foreignField: '_id',
                localField: 'mintedMonsterId',
                as: 'mintedMonster'
            }
        },
        {
            $unwind: '$mintedMonster'
        },
        {
            $lookup: {
                from: 'monsters',
                foreignField: '_id',
                localField: 'mintedMonster.monsterId',
                as: 'monster'
            }
        },
        {
            $unwind: '$monster'
        },
    ]).skip(skip).limit(limit)

    const count = await TradeItem.find().countDocuments()
    res.status(200).json({ tradeItems, count, message: "Trade items retrived successfully" });
};

exports.allInTradeSearch = async function (req, res) {

    const parsed = JSON.parse(req.body.data)
    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);

    const tokenId = parsed.tokenId
    const starArray = parsed.starArray
    const order = parsed.order

    let filter = {}
    let count = 0
    let tradeItems

    if(starArray.length > 0) {
        filter['mintedMonster.rating'] = {
            $in: starArray
        }
    }
    if(tokenId != '') {
        filter['mintedMonster.tokenId'] = tokenId
    }
    
    if(starArray.length > 0 || tokenId != '') {
        tradeItems = await TradeItem.aggregate([
            {
                $lookup: {
                    from: 'mintedmonsters',
                    foreignField: '_id',
                    localField: 'mintedMonsterId',
                    as: 'mintedMonster'
                }
            },
            {
                $unwind: '$mintedMonster'
            },
            {
                $lookup: {
                    from: 'monsters',
                    foreignField: '_id',
                    localField: 'mintedMonster.monsterId',
                    as: 'monster'
                }
            },
            {
                $unwind: '$monster'
            },
            {
                $match: { ...filter }
            },
            
        ]).skip(skip).limit(limit)
        const countArray = await TradeItem.aggregate([
            {
                $lookup: {
                    from: 'mintedmonsters',
                    foreignField: '_id',
                    localField: 'mintedMonsterId',
                    as: 'mintedMonster'
                }
            },
            {
                $unwind: '$mintedMonster'
            },
            {
                $match: { ...filter }
            },
            {
                $count: "count"
              }
            
        ])
        count = countArray.length && countArray[0].count
    } else {
        tradeItems = await TradeItem.aggregate([
            {
                $lookup: {
                    from: 'mintedmonsters',
                    foreignField: '_id',
                    localField: 'mintedMonsterId',
                    as: 'mintedMonster'
                }
            },
            {
                $unwind: '$mintedMonster'
            },
            {
                $lookup: {
                    from: 'monsters',
                    foreignField: '_id',
                    localField: 'mintedMonster.monsterId',
                    as: 'monster'
                }
            },
            {
                $unwind: '$monster'
            },
        ]).skip(skip).limit(limit)
        count = await TradeItem.find().countDocuments()
    }
    if(order == 'asc') {
        tradeItems.sort(function(a, b) {
            return Number(a.price) - Number(b.price);
        });
    } else if(order == 'desc') {
        tradeItems.sort(function(a, b) {
            return Number(b.price) - Number(a.price);
        })
    }

    res.status(200).json({ tradeItems, count, message: "Trade items retrived successfully" });
};


exports.buyFromAllTradeItems = async function (req, res) {

    await MintedMonster.findByIdAndUpdate(req.body.mintedId, {
        $set: {
            owner: req.body.buyer, 'values.Energy': req.body.Energy,
            'values.EXP': req.body.EXP,
            'values.UpdateTime': req.body.UpdateTime
        }
    }, { new: true });
    await TradeItem.findByIdAndDelete(req.body.tradeId);

    res.status(200).json({ message: "Trade done successfully" });
};