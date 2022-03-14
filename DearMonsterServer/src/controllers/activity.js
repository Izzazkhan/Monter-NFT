const Activity = require('../models/activity');


exports.index = async function (req, res) {
    const activity = await Activity.find({});
    res.status(200).json({activity});
};


exports.store = async (req, res) => {
    try {

        const activity = new Activity({...req.body});
        const activity_ = await activity.save();
        
        res.status(200).json({message: 'New activity created successfully', activity: activity_});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};

// exports.show = async function (req, res) {
//     try {
//         const id = req.params.id;

//         const activity = await Activity.findById(id);
//         if (!activity) return res.status(401).json({message: 'activity does not exist'});
        
//         res.status(200).json({activity});
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// };
