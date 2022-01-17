const Monster = require('../models/monster');
const {uploader} = require('../utils/index');


exports.index = async function (req, res) {
    const monsters = await Monster.find({});
    res.status(200).json({monsters});
};


exports.store = async (req, res) => {
    try {
        const { img } = req.body;
        
        // Must uncomment for verification
        const monster = await Monster.findOne({img});
        if (monster) return res.status(401).json({message: 'The monster already exist.'});

        const newMonster = new Monster({...req.body});
        const monster_ = await newMonster.save();
        
        res.status(200).json({message: 'Monster created successfully', monster: monster_});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const monster = await Monster.findById(id);
        if (!monster) return res.status(401).json({message: 'Monster does not exist'});
        
        res.status(200).json({monster});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.update = async function (req, res) {
    try {

        const id = req.params.id;
        const update = req.body;
        // const userId = req.user._id;

        // const userId = req.user._id;
        // Must uncomment for verification
        // if (userId.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        const monster = await Monster.findByIdAndUpdate(id, {$set: update}, {new: true});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({monster, message: 'Monster has been updated'});

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

        await Monster.findByIdAndDelete(id);
        res.status(200).json({message: 'Monster has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};