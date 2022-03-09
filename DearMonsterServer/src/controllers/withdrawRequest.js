const WithdrawRequest = require('../models/withdrawRequest');
const UserEarning = require('../models/userEarning');


exports.userWithdrawRequest = async function (req, res) {

    const wallet = req.params.wallet;

    const withdrawRequest = await WithdrawRequest.find({ requesterAddress: wallet, type: req.params.type });
    res.status(200).json({ withdrawRequest });
};

exports.claimHistory = async function (req, res) {

    const wallet = req.params.wallet;

    const withdrawRequestApproved = await WithdrawRequest.find({ requesterAddress: wallet, isResolved: true, type: req.params.type}, null, { sort: { 'updatedAt' : -1 }}).limit(5)
    res.status(200).json({ withdrawRequestApproved });
};

exports.userResolvedWithdrawRequest = async function (req, res) {

    const wallet = req.params.wallet;

    const withdrawRequest = await WithdrawRequest.findOne({ isResolved: true, requesterAddress: wallet, type: req.params.type }, null, { sort: { 'updatedAt' : -1 }});
    res.status(200).json({withdrawRequest});
};

exports.index = async function (req, res) {
    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);
    const count = await WithdrawRequest.find().countDocuments()
    const withdrawRequest = await WithdrawRequest.find({}).skip(skip).limit(limit)
    res.status(200).json({ withdrawRequest, count });
};

exports.pending = async function (req, res) {

    const wallet = req.params.wallet;

    const openWithdrawRequest = await WithdrawRequest.findOne({ isResolved: false, requesterAddress: wallet, type: req.params.type }, null, { sort: { 'updatedAt' : -1 }});
    res.status(200).json({ openWithdrawRequest });
};

exports.requestByWallet = async function (req, res) {

    const wallet = req.params.wallet;
    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);
    const count = await WithdrawRequest.find({ requesterAddress: wallet }).countDocuments()

    const withdrawRequest = await WithdrawRequest.find({ requesterAddress: wallet }).skip(skip).limit(limit);
    console.log(withdrawRequest)
    res.status(200).json({ withdrawRequest, count });
};


exports.store = async (req, res) => {
    try {

        const newRequest = new WithdrawRequest({ ...req.body, type: req.params.type });
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

        // let query = {id, type: req.params.type}
        // let updateData = {$set: update}
        // let options = { new: true }
        
        // const withdrawRequest = await WithdrawRequest.findOneAndUpdate(query, updateData, options);

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