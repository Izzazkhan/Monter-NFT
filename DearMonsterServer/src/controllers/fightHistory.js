const FightHistory = require('../models/fightHistory');


exports.index = async function (req, res) {

    const fightLog = await FightHistory.aggregate([
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
        },
        {
            $lookup: {
                from: 'minions',
                foreignField: '_id',
                localField: 'minionId',
                as: 'minion'
            }
        },
        {
            $unwind: '$minion'
        }
    ])
    res.status(200).json({fightLog});
};


exports.store = async (req, res) => {
    try {

        const fightLog = new FightHistory({...req.body});
        const fightLog_ = await fightLog.save();
        
        res.status(200).json({message: 'Fight History created successfully', fightLog: fightLog_});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};

// exports.show = async function (req, res) {
//     try {
//         const id = req.params.id;

//         const levelBonus = await FightHistory.findById(id);
//         if (!levelBonus) return res.status(401).json({message: 'levelBonus does not exist'});
        
//         res.status(200).json({levelBonus});
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// };

// exports.update = async function (req, res) {
//     try {


//         const id = req.params.id;
//         const update = req.body;
//         // const userId = req.user._id;

//         // Must uncomment for verification
//         // if (userId.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

//         const levelBonus = await FightHistory.findByIdAndUpdate(id, {$set: update}, {new: true});
//         return res.status(200).json({levelBonus, message: 'levelBonus has been updated'});
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };


// exports.destroy = async function (req, res) {
//     try {
//         const id = req.params.id;
//         // const user_id = req.user._id;
//         //Make sure the passed id is that of the logged in user

//         // Must uncomment for verification
//         // if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

//         await FightHistory.findByIdAndDelete(id);
//         res.status(200).json({message: 'FightHistory has been deleted'});
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };