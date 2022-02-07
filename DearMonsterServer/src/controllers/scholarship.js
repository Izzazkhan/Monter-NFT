const Scholarship = require('../models/scholarship');
const MintedMonster = require('../models/mintedMonster');

exports.store = async (req, res) => {
    try {

        let id = req.params.id

        const newScholarship = new Scholarship({ ...req.body });
        const scholarship_ = await newScholarship.save();

        let update = { scholarId: scholarship_._id }
        const mintedMonster = await MintedMonster.findByIdAndUpdate(id, { $set: update }, { new: true })

        res.status(200).json({ message: 'Minted Monster got on scholar successfully', mintedMonster });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

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
        ]).populate('scholarId')

        if (!mintedMonster) return res.status(401).json({ message: 'MintedMonster does not exist' });

        res.status(200).json({ mintedMonster });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.destroy = async function (req, res) {
    try {
        const id = req.params.id

        await MintedMonster.findByIdAndUpdate(id, { $unset: { 'req.body.scholarId': 1 } }, { new: true });
        res.status(200).json({ message: 'MintedMonster scholar is removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};