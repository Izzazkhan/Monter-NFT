const UserEarning = require('../models/userEarning');


exports.show = async function (req, res) {
    try {
        const earnerAddress = req.params.earnerAddress;

        const earnerData = await UserEarning.findOne({earnerAddress, isRequested: false, type: req.params.type});

        // if (!earnerData) return res.status(401).json({message: 'record against earnerData does not exist'});
        
        res.status(200).json({earnerData, message: 'earner scholar data fetched successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.store = async (req, res) => {

    try {
        const userEarning = new UserEarning({...req.body});
        const userEarning_ = await userEarning.save();
        
        res.status(200).json({message: 'Request created successfully', userEarning: userEarning_});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
};

exports.rewardByWallet = async function (req, res) {

    const wallet = req.params.earnerAddress;
    console.log(wallet)

    const rewardByWallet = await UserEarning.find({ isRequested: false, earnerAddress: wallet });
    res.status(200).json({ rewardByWallet });
};

exports.update = async function (req, res) {
    try {

        const earnerAddress = req.params.earnerAddress;
        const update = req.body;


        let query = {earnerAddress, isRequested: false, type: req.params.type}
        let updateData = {$set: update}
        let options = { new: true, upsert: true }
        
        const userEarning = await UserEarning.findOneAndUpdate(query, updateData, options);

        if (!req.file) return res.status(200).json({userEarning, message: 'userEarning has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.destroy = async function (req, res) {
    try {
        const earnerAddress = req.params.earnerAddress;

        await UserEarning.findOneAndDelete({earnerAddress});
        res.status(200).json({message: 'UserEarning has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};