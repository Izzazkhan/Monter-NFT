const LevelBonus = require('../models/levelBonus');


exports.index = async function (req, res) {
    const levelBonus = await LevelBonus.find({});
    res.status(200).json({levelBonus});
};


exports.store = async (req, res) => {
    try {

        const levelBonus = new LevelBonus({...req.body});
        const levelBonus_ = await levelBonus.save();
        
        res.status(200).json({message: 'Level Bonus created successfully', levelBonus: levelBonus_});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const levelBonus = await LevelBonus.findById(id);
        if (!levelBonus) return res.status(401).json({message: 'levelBonus does not exist'});
        
        res.status(200).json({levelBonus});
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

        const levelBonus = await LevelBonus.findByIdAndUpdate(id, {$set: update}, {new: true});
        return res.status(200).json({levelBonus, message: 'levelBonus has been updated'});
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

        await LevelBonus.findByIdAndDelete(id);
        res.status(200).json({message: 'LevelBonus has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};