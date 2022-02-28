const ProbabiltyList = require('../models/probList');


exports.index = async function (req, res) {
    const probabiltyList = await ProbabiltyList.find({});
    res.status(200).json({probabiltyList});
};


exports.store = async (req, res) => {
    try {

        const probabiltyList = new ProbabiltyList({...req.body});
        const probabiltyList_ = await probabiltyList.save();
        
        res.status(200).json({message: 'Probabilty list created successfully', probabiltyList: probabiltyList_});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};

exports.update = async function (req, res) {
    try {


        const id = req.params.id;
        const update = req.body;
        // const userId = req.user._id;

        // Must uncomment for verification
        // if (userId.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        const probabilityList = await ProbabiltyList.findByIdAndUpdate(id, {$set: update}, {new: true});
        return res.status(200).json({probabilityList, message: 'Probability list has been updated'});
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

        await ProbabiltyList.findByIdAndDelete(id);
        res.status(200).json({message: 'ProbabiltyList has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};