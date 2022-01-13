const Minion = require('../models/minion');
const {uploader} = require('../utils/index');


exports.index = async function (req, res) {
    const minions = await Minion.find({});
    res.status(200).json({minions});
};


exports.store = async (req, res) => {
    try {
        const { name } = req.body;

        console.log("req.body")
        console.log(req.body)
        

        // Must uncomment for verification
        // const minion = await Minion.findOne({name});
        // if (minion) return res.status(401).json({message: 'The minion already exist.'});

        const newMinion = new Minion({...req.body});
        const minion_ = await newMinion.save();
        
        res.status(200).json({message: 'Minion created successfully', minion: minion_});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const minion = await Minion.findById(id);
        if (!minion) return res.status(401).json({message: 'Minion does not exist'});
        
        res.status(200).json({minion});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.update = async function (req, res) {
    try {


        const id = req.params.id;
        const update = req.body;
        // const userId = req.user._id;

        console.log("=================")
        console.log(update)
        console.log(id)

        // Must uncomment for verification
        // if (userId.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        const minion = await Minion.findByIdAndUpdate(id, {$set: update}, {new: true});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({minion, message: 'Minion has been updated'});

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


        console.log('-----------------')

        const id = req.params.id;


        // const user_id = req.user._id;
        //Make sure the passed id is that of the logged in user

        // Must uncomment for verification
        // if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        await Minion.findByIdAndDelete(id);
        res.status(200).json({message: 'Minion has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};