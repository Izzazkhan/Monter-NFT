const WheelHistory = require('../models/wheelHistory');

exports.index = async function (req, res) {
    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);
    const count = await WheelHistory.find().countDocuments()
    const wheelHistory = await WheelHistory.find({}).skip(skip).limit(limit)
    res.status(200).json({ wheelHistory, count });
};

exports.getAllCategories = async function (req, res) {

    const count = await WheelHistory.find().countDocuments()
    const wheelHistory = await WheelHistory.find()
    const filteredCategories = wheelHistory.filter((category, i) => 
    wheelHistory.findIndex((s) => category.name === s.name) === i)
    res.status(200).json({ filteredCategories, count });
};

exports.historyByCategory = async function (req, res) {

    const name = req.params.name;
    // const limit = parseInt(req.query.limit); 
    // const skip = parseInt(req.query.skip);
    const count = await WheelHistory.find({ name: name }).countDocuments()
    const wheelHistory = await WheelHistory.find({ name: name }) // .skip(skip).limit(limit);
    res.status(200).json({ wheelHistory, count });
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
