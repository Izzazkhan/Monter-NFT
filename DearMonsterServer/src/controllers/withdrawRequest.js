const WithdrawRequest = require('../models/withdrawRequest');
const UserEarning = require('../models/userEarning');


exports.userWithdrawRequest = async function (req, res) {

    const wallet = req.params.wallet;

    const withdrawRequest = await WithdrawRequest.find({ requesterAddress: wallet });
    res.status(200).json({ withdrawRequest });
};


exports.userResolvedWithdrawRequest = async function (req, res) {

    const wallet = req.params.wallet;

    const withdrawRequest = await WithdrawRequest.findOne({ isResolved: true, requesterAddress: wallet }, null, { sort: { 'updatedAt' : -1 }});
    res.status(200).json({withdrawRequest});
};

exports.index = async function (req, res) {
    const withdrawRequest = await WithdrawRequest.find({});
    res.status(200).json({ withdrawRequest });
};

exports.pending = async function (req, res) {

    const wallet = req.params.wallet;

    const openWithdrawRequest = await WithdrawRequest.findOne({ isResolved: false, requesterAddress: wallet }, null, { sort: { 'updatedAt' : -1 }});
    res.status(200).json({ openWithdrawRequest });
};


exports.store = async (req, res) => {
    try {

        const newRequest = new WithdrawRequest({ ...req.body });
        const newRequest_ = await newRequest.save();

        const { requesterAddress } = req.body

        // UserEarning requesterAddress
        const withdrawRequest = await UserEarning.findOneAndUpdate({requesterAddress}, { $set: { isRequested: true } });

        res.status(200).json({ message: 'Request created successfully', newRequest: newRequest_ });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const withdrawRequest = await WithdrawRequest.findById(id);
        if (!withdrawRequest) return res.status(401).json({ message: 'WithdrawRequest does not exist' });

        res.status(200).json({ withdrawRequest });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.update = async function (req, res) {
    try {

        const id = req.params.id;
        const update = req.body;

        const withdrawRequest = await WithdrawRequest.findByIdAndUpdate(id, { $set: update }, { new: true });

        //Attempt to upload to cloudinary
        // const result = await uploader(req);
        // const minon_ = await Minion.findByIdAndUpdate(id, {$set: update}, {$set: {profileImage: result.url}}, {new: true});

        if (!req.file) return res.status(200).json({ withdrawRequest, message: 'withdrawRequest has been updated' });

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

        await WithdrawRequest.findByIdAndDelete(id);
        res.status(200).json({ message: 'WithdrawRequest has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};