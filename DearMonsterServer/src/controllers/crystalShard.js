const CrystalShard = require('../models/crystalShards');


exports.index = async function (req, res) {
    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);
    const count = await CrystalShard.find().countDocuments()
    const cystalShard = await CrystalShard.find({}).skip(skip).limit(limit)
    res.status(200).json({cystalShard, count});
};


exports.store = async (req, res) => {
    try {
        let cystalShard
        console.log(req.file)
        const parsed = JSON.parse(req.body.data);
        console.log(parsed)
        if(req.file) {
            cystalShard = await CrystalShard.create({
                name: parsed.name,
                description: parsed.description,
                crystalImage: req.file ? req.file.path : null
            });
        } else {
            cystalShard = await CrystalShard.create({
                name: parsed.name,
                description: parsed.description
            });
        }
        
        res.status(200).json({message: 'Crystal Shard created successfully', cystalShard});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const cystalShard = await CrystalShard.findById(id);
        if (!cystalShard) return res.status(401).json({message: 'cystalShard does not exist'});
        
        res.status(200).json({cystalShard});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.update = async function (req, res) {
    try {
        let cystalShard
        const id = req.params.id;

        const parsed = JSON.parse(req.body.data);
        if(req.file) {
            cystalShard = await CrystalShard.findByIdAndUpdate(id, {$set: {
                name: parsed.name,
                description: parsed.description,
                crystalImage: req.file ? req.file.path : null
            }}, {new: true});
        } else {
            cystalShard = await CrystalShard.findByIdAndUpdate(id, {$set: {
                name: parsed.name,
                description: parsed.description
            }}, {new: true});
        }

        return res.status(200).json({cystalShard, message: 'cystalShard has been updated'});
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

        await CrystalShard.findByIdAndDelete(id);
        res.status(200).json({message: 'CrystalShard has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};