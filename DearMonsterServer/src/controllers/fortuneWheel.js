const FortuneWheel = require('../models/fortuneWheel');


exports.index = async function (req, res) {
    const fortuneWheel = await FortuneWheel.find({});
    console.log(fortuneWheel)
    res.status(200).json({fortuneWheel});
};


exports.store = async (req, res) => {
    const slotsParsed = JSON.parse(req.body.slots)
    try {

        const fortuneWheel = new FortuneWheel({wheelName: req.body.wheelName, isActive: req.body.isActive, slots: slotsParsed});
        const fortuneWheel_ = await fortuneWheel.save();
        
        res.status(200).json({message: 'Fortune Wheel created successfully', fortuneWheel: fortuneWheel_});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const fortuneWheel = await FortuneWheel.findById(id);
        if (!fortuneWheel) return res.status(401).json({message: 'fortune Wheel does not exist'});
        
        res.status(200).json({fortuneWheel});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.update = async function (req, res) {
    const slotsParsed = JSON.parse(req.body.slots)

    try {


        const id = req.params.id;
        const update = {wheelName: req.body.wheelName, isActive: req.body.isActive, slots: slotsParsed}
        // const userId = req.user._id;

        // Must uncomment for verification
        // if (userId.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        const fortuneWheel = await FortuneWheel.findByIdAndUpdate(id, {$set: update}, {new: true});
        // const fortuneWheel = await FortuneWheel.find({});
        return res.status(200).json({fortuneWheel, message: 'fortune Wheel has been updated'});
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

        await FortuneWheel.findByIdAndDelete(id);
        res.status(200).json({message: 'Fortune Wheel has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};