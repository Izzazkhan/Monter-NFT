const UserShard = require('../models/userShards');
const CrystalShard = require('../models/crystalShards');

exports.index = async function (req, res) {
    const userShard = await UserShard.find({});
    res.status(200).json({userShard});
};

exports.store = async (req, res) => {
    try {
        // const crystalShard = await CrystalShard.find()
        // const _randomslice = (ar, size) => {
        //     let new_ar = [...ar];
        //     // console.log(new_ar)
        //     new_ar.splice(Math.floor(Math.random()*ar.length),1);
        //     return ar.length <= (size+1) ? new_ar : _randomslice(new_ar, size);
        //   }
        //   let userShard_ = _randomslice(crystalShard,2)
        //   let userShard__
        //   userShard_.map(async item => {
        //         const userShard = new UserShard({userId: req.body.userId, shardId: item});
        //         console.log('userSharduserShard', userShard)
        //         userShard__ = await userShard.save()
        //     })
        //   console.log('userShard_', userShard__)
          

        const userShard = new UserShard({...req.body});
        const userShard_ = await userShard.save();
        
        res.status(200).json({message: 'User shard stored successfully', userShard: userShard_});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};

exports.show = async function (req, res) {
        try {
            
            const userId = req.params.userId;
    
            // const userShard = await UserShard.find({userId, type: req.params.type});



            const userShards = await UserShard.aggregate([
                {
                    $match: {
                        userId: userId
                    }
                },
                {
                    $lookup: {
                        from: 'shards',
                        foreignField: '_id',
                        localField: 'shardId',
                        as: 'shards'
                    }
                },
                {
                    $unwind: "$shards"
                },
                {
                    $lookup: {
                        from: 'shardtypes',
                        foreignField: '_id',
                        localField: 'shards.shardTypeId',
                        as: 'shardTypes'
                    }
                },
                {
                    $unwind: "$shardTypes"
                }
            ]);

    
            // if (!userShard) return res.status(401).json({message: 'record against userShard does not exist'});
            
            res.status(200).json({userShards, message: 'user shards fetched successfully'});
        } catch (error) {
            res.status(500).json({message: error.message})
        }
};

exports.byUserShard = async function (req, res) {
    try {
        
        const userId = req.params.userId;
        const userShard = await UserShard.find({userId});

        if (!userShard) return res.status(401).json({message: 'record against userShard does not exist'});
        
        res.status(200).json({userShard, message: 'user shards fetched successfully'});
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

        const userShard = await UserShard.findByIdAndUpdate(id, {$set: update}, {new: true});
        return res.status(200).json({userShard, message: 'userShard has been updated'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

    // try {
    //     const userId = req.params.userId;
    //     const update = req.body;

    //     let query = {userId, type: req.params.type}
    //     let updateData = {$set: update}
    //     let options = { new: true, upsert: true }
        
    //     const userShard = await UserShard.findOneAndUpdate(query, updateData, options);

    //     if (!req.file) return res.status(200).json({userShard, message: 'userShard has been updated'});

    // } catch (error) {
    //     res.status(500).json({message: error.message});
    // }
};


// exports.destroy = async function (req, res) {
//     try {
//         const id = req.params.id;
//         // const user_id = req.user._id;
//         //Make sure the passed id is that of the logged in user

//         // Must uncomment for verification
//         // if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

//         await UserShard.findByIdAndDelete(id);
//         res.status(200).json({message: 'UserShard has been deleted'});
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };