const WheelHistory = require('../models/wheelHistory');


exports.index = async function (req, res) {

    const wheelHistory = await WheelHistory.find()
    res.status(200).json({wheelHistory});
};


exports.store = async (req, res) => {
    try {

        const wheelHistory = new WheelHistory({...req.body});
        const wheelHistory_ = await wheelHistory.save();
        
        res.status(200).json({message: 'Wheel history created successfully', wheelHistory: wheelHistory_});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
};
