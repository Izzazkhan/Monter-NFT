const ShardType = require('../models/shardType');

exports.index = async function (req, res) {
    console.log(req.query)
    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);
    const count = await ShardType.find().countDocuments()
    const shardType = await ShardType.find({}).skip(skip).limit(limit)
    console.log(shardType)
    res.status(200).json({shardType, count});
};

exports.store = async (req, res) => {
    try {
        let shardType
        console.log(req.file)
        const parsed = JSON.parse(req.body.data);
        console.log(parsed)
        if(req.file) {
            shardType = await ShardType.create({
                typeName: parsed.typeName,
                image: req.file ? req.file.path : null
            });
        } else {
            shardType = await ShardType.create({
                typeName: parsed.typeName,
            });
        }
        
        res.status(200).json({message: 'Crystal Shard created successfully', shardType});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const shardType = await ShardType.findById(id);
        if (!shardType) return res.status(401).json({message: 'shardType does not exist'});
        
        res.status(200).json({shardType});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.update = async function (req, res) {
    try {
        let shardType
        const id = req.params.id;

        const parsed = JSON.parse(req.body.data);
        if(req.file) {
            shardType = await ShardType.findByIdAndUpdate(id, {$set: {
                typeName: parsed.typeName,
                image: req.file ? req.file.path : null
            }}, {new: true});
        } else {
            shardType = await ShardType.findByIdAndUpdate(id, {$set: {
                typeName: parsed.typeName,
            }}, {new: true});
        }

        return res.status(200).json({shardType, message: 'ShardType has been updated'});
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

        await ShardType.findByIdAndDelete(id);
        res.status(200).json({message: 'ShardType has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};