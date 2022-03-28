const BUSDRequest = require('../models/BUSDRequest');
const UserEarning = require('../models/userEarning');


exports.userWithdrawRequest = async function (req, res) {

    const wallet = req.params.wallet;

    const BUSDRequest_ = await BUSDRequest.find({ requesterAddress: wallet, type: req.params.type, isResolved: false });
    console.log(BUSDRequest_)

    res.status(200).json({ BUSDRequest_ });
};

exports.claimHistory = async function (req, res) {

    const wallet = req.params.wallet;

    const withdrawRequestApproved = await BUSDRequest.find({ requesterAddress: wallet, isResolved: true, type: req.params.type}, null, { sort: { 'updatedAt' : -1 }}).limit(5)
    res.status(200).json({ withdrawRequestApproved });
};

exports.userResolvedWithdrawRequest = async function (req, res) {

    const wallet = req.params.wallet;

    const BUSDRequest = await BUSDRequest.findOne({ isResolved: true, requesterAddress: wallet, type: req.params.type }, null, { sort: { 'updatedAt' : -1 }});
    res.status(200).json({BUSDRequest});
};

exports.index = async function (req, res) {
    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);
    const count = await BUSDRequest.find().countDocuments()
    const BUSDRequest_ = await BUSDRequest.find({}).skip(skip).limit(limit)
    console.log('BUSDRequest_', BUSDRequest_)
    res.status(200).json({ BUSDRequest_, count });
};

exports.pending = async function (req, res) {

    const wallet = req.params.wallet;

    const openWithdrawRequest = await BUSDRequest.findOne({ isResolved: false, requesterAddress: wallet, type: req.params.type }, null, { sort: { 'updatedAt' : -1 }});
    res.status(200).json({ openWithdrawRequest });
};

exports.requestByWallet = async function (req, res) {

    const wallet = req.params.wallet;
    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);
    const count = await BUSDRequest.find({ requesterAddress: wallet }).countDocuments()

    const BUSDRequest = await BUSDRequest.find({ requesterAddress: wallet }).skip(skip).limit(limit);
    console.log(BUSDRequest)
    res.status(200).json({ BUSDRequest, count });
};


exports.store = async (req, res) => {
    try {

        const newRequest = new BUSDRequest({ ...req.body, type: req.params.type });
        const newRequest_ = await newRequest.save();

        const { requesterAddress } = req.body
        let update = { isRequested: true, type: req.params.type }

        // UserEarning requesterAddress
        await UserEarning.findOneAndUpdate({earnerAddress: requesterAddress, type: req.params.type, isRequested: false}, { $set: update });
        res.status(200).json({ message: 'Request created successfully', newRequest: newRequest_ });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const BUSDRequest = await BUSDRequest.findById(id);
        if (!BUSDRequest) return res.status(401).json({ message: 'BUSDRequest does not exist' });

        res.status(200).json({ BUSDRequest });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.update = async function (req, res) {
    try {

        const id = req.params.id;
        const wallet = req.params.wallet;
        const update = {requesterAddress: wallet, type: req.params.type, amount: req.body.amount}

        const BUSDRequest_ = await BUSDRequest.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (!req.file) return res.status(200).json({ BUSDRequest_, message: 'BUSDRequest has been updated' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.statusUpdate = async function (req, res) {
    try {

        const id = req.params.id;
        const update = {isResolved: true}

        const BUSDRequest_ = await BUSDRequest.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (!req.file) return res.status(200).json({ BUSDRequest_, message: 'BUSDRequest has been updated' });

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

        await BUSDRequest.findByIdAndDelete(id);
        res.status(200).json({ message: 'BUSDRequest has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};