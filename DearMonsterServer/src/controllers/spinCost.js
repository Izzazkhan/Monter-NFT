const SpinCost = require('../models/spinCost');


exports.index = async function (req, res) {
    const spinCost = await SpinCost.find({});
    res.status(200).json({spinCost});
};

exports.store = async (req, res) => {
    try {
        const spinCost = new SpinCost({...req.body});
        const spinCost_ = await spinCost.save();
        
        res.status(200).json({message: 'Spin Cost created successfully', spinCost: spinCost_});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const spinCost = await SpinCost.findById(id);
        if (!spinCost) return res.status(401).json({message: 'Spin cost does not exist'});
        
        res.status(200).json({spinCost});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.update = async function (req, res) {
    try {
        const id = req.params.id;
        const update = req.body
        // const userId = req.user._id;

        // Must uncomment for verification
        // if (userId.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        const spinCost = await SpinCost.findByIdAndUpdate(id, {$set: update}, {new: true});
        return res.status(200).json({spinCost, message: 'Spin cost has been updated'});
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

        await SpinCost.findByIdAndDelete(id);
        res.status(200).json({message: 'Spin cost has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};