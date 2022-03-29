const Shards = require('../models/shards');


exports.index = async function (req, res) {

    // const limit = parseInt(req.query.limit); 
    // const skip = parseInt(req.query.skip);
    // const count = await Shards.find().countDocuments()
    const shards = await Shards.aggregate([
        {
            $lookup: {
                from: 'shardtypes',
                foreignField: '_id',
                localField: 'shardTypeId',
                as: 'shardType'
            }
        },
        {
            $unwind: '$shardType'
        }
    ]) // .skip(skip).limit(limit)
    res.status(200).json({shards});
};



exports.store = async (req, res) => {
    try {

        const shards = new Shards({...req.body});
        const shard_ = await shards.save();
        
        res.status(200).json({message: 'Shard created successfully', shards: shard_});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const shards = await Shards.findById(id);
        if (!shards) return res.status(401).json({message: 'shards does not exist'});
        
        res.status(200).json({shards});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.update = async function (req, res) {
    try {


        const id = req.params.id;
        const update = req.body;
        // const userId = req.user._id;

        // Must uncomment for verification
        // if (userId.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        const shards = await Shards.findByIdAndUpdate(id, {$set: update}, {new: true});
        return res.status(200).json({shards, message: 'shards has been updated'});
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

        await Shards.findByIdAndDelete(id);
        res.status(200).json({message: 'Shards has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};