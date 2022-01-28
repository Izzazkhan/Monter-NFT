const MintedMonster = require('../models/mintedMonster');

exports.setEnergyTime = async function (req, res) {
    try {

        let id = req.params.id
        let update = req.body

        const mintedMonster = await MintedMonster.findByIdAndUpdate(id, { $set: update }, { new: true });

        res.status(200).json({ message: 'Minted Monster energy time updated successfully', mintedMonster });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.index = async function (req, res) {
    const { owner } = req.params;

    const mintedMonster = await MintedMonster.aggregate([
        {
            $match: { owner }
        },
        {
            $lookup: {
                from: 'monsters',
                foreignField: '_id',
                localField: 'monsterId',
                as: 'monster'
            }
        },
        {
            $unwind: '$monster'
        },
        {
            $lookup: {
                from: 'tradeitems',
                foreignField: 'mintedMonsterId',
                localField: '_id',
                as: 'tradeitem'
            }
        },
    ]);
    res.status(200).json({ mintedMonster, message: "Minted monsters retrived successfully" });
};


exports.store = async (req, res) => {
    try {

        const { tokenId } = req.body;
        // Must uncomment for verification
        const mintedMonster = await MintedMonster.findOne({ tokenId });
        if (mintedMonster) return res.status(401).json({ message: 'TokenId cannot be duplicate.' });

        const newMintedMonster = new MintedMonster({ ...req.body });
        const mintedMonster_ = await newMintedMonster.save();

        res.status(200).json({ message: 'Minted Monster created successfully', mintedMonster_ });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;
        const mintedMonster = await MintedMonster.aggregate([
            {
                $match: { _id: id }
            },
            {
                $lookup: {
                    from: 'Monster',
                    foreignField: '_id',
                    localField: 'monsterId',
                    as: 'monster'
                }
            },
            {
                $unwind: '$monster'
            }
        ]);

        if (!mintedMonster) return res.status(401).json({ message: 'MintedMonster does not exist' });

        res.status(200).json({ mintedMonster });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.update = async function (req, res) {
    try {

        const id = req.params.id;
        const update = req.body;

        console.log("========")
        console.log(update)

        // const userId = req.user._id;
        // Must uncomment for verification
        // if (userId.toString() !== id.toString()) return res.status(401).json({message: "Access denied.."});

        const mintedMonster = await MintedMonster.findByIdAndUpdate(id, { $set: update }, { new: true });

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({ mintedMonster, message: 'mintedMonster has been updated' });

        //Attempt to upload to cloudinary
        // const result = await uploader(req);
        // const minon_ = await Minion.findByIdAndUpdate(id, {$set: update}, {$set: {profileImage: result.url}}, {new: true});

        // if (!req.file) return res.status(200).json({user: user_, message: 'Minion has been updated'});

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

        await MintedMonster.findByIdAndDelete(id);
        res.status(200).json({ message: 'MintedMonster has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};