const SpinRecord = require('../models/spinRecord');


exports.index = async function (req, res) {
    const spinRecord = await SpinRecord.find({});
    console.log('========', spinRecord, '=========')
    res.status(200).json({ spinRecord, message: 'Spin Record data fetched successfully' });
    // console.log(req.params)
    // try {
    //     const userId = req.params.userId;

    //     const spinRecord = await SpinRecord.findOne({userId, type: req.params.type});

    //     // if (!spinRecord) return res.status(401).json({message: 'record against spinRecord does not exist'});

    //     res.status(200).json({spinRecord, message: 'Spin Record data fetched successfully'});
    // } catch (error) {
    //     res.status(500).json({message: error.message})
    // }
};

exports.store = async (req, res) => {
    console.log(req.body)
    try {
        const spinRecord = new SpinRecord({ ...req.body });
        const spinRecord_ = await spinRecord.save();

        res.status(200).json({ message: 'Spin Record created successfully', spinRecord: spinRecord_ });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.show = async function (req, res) {
    try {
        const userId = req.params.userId;

        const spinRecord = await SpinRecord.find({ userId: userId });
        if (!spinRecord) return res.status(401).json({ message: 'Spin record does not exist' });

        res.status(200).json({ spinRecord });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.update = async function (req, res) {
    try {
        const userId = req.params.userId;
        const update = req.body;

        console.log("update =======")
        console.log(update)
        console.log("type =======")
        console.log(type)


        let query = { userId, type: req.params.type }
        let updateData = { $set: { no_of_spin: req.body.no_of_spin } }
        let options = { new: true, upsert: true }

        const spinRecord = await SpinRecord.findOneAndUpdate(query, updateData, options);

        return res.status(200).json({ spinRecord, message: 'Spin record has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        // const user_id = req.user._id;
        //Make sure the passed id is that of the logged in user

        // Must uncomment for verification
        // if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        await SpinRecord.findByIdAndDelete(id);
        res.status(200).json({ message: 'Spin record has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};