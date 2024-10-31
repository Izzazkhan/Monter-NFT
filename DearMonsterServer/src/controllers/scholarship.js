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

exports.index = async function (req, res) {
    const { owner } = req.params;
    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);

    let mintedMonster = await MintedMonster.aggregate([
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
        {
            $lookup: {
                from: 'scholarships',
                foreignField: '_id',
                localField: 'scholarId',
                as: 'scholarshipsItems'
            }
        }
    ]).skip(skip).limit(limit)

    const count = await MintedMonster.find({owner: owner}).countDocuments()
    res.status(200).json({ mintedMonster, count, message: "Minted monsters retrived successfully" });
}

exports.onScholar = async function (req, res) {
    console.log('onScholar')
    const { owner } = req.params;
    const limit = parseInt(req.query.limit); 
    const skip = parseInt(req.query.skip);
    let mintedMonster = await MintedMonster.aggregate([
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
        {
            $lookup: {
                from: 'scholarships',
                foreignField: '_id',
                localField: 'scholarId',
                as: 'scholarshipsItems'
            }
        },
        {
            $unwind: '$scholarshipsItems'
        },
    ]).skip(skip).limit(limit)
    const countArray = await MintedMonster.aggregate([
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
        {
            $lookup: {
                from: 'scholarships',
                foreignField: '_id',
                localField: 'scholarId',
                as: 'scholarshipsItems'
            }
        },
        {
            $unwind: '$scholarshipsItems'
        },
    ])

    const count = countArray.length
    res.status(200).json({ mintedMonster, count, message: "Minted monsters retrived successfully" });
}

exports.scholarItems = async function (req, res) {
    const { scholar } = req.params;
    
    let mintedMonster = await MintedMonster.aggregate([
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
                from: 'scholarships',
                foreignField: '_id',
                localField: 'scholarId',
                as: 'scholarshipsItems'
            }
        },
        {
            $unwind: '$scholarshipsItems'
        },
        {
            $match: { 
                'scholarshipsItems.scholarWallet': scholar 
            }
        }
    ])

    res.status(200).json({ mintedMonster, message: "got scholar monsters retrived successfully" });
}

exports.update = async function (req, res) {
    try {

        const { id } = req.params
        console.log(id)
        let update = { assigned: true }
        await Scholarship.findByIdAndUpdate(id, { $set: update }, { new: true })

        res.status(200).json({ message: 'Monster scholar request accepted' })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.destroy = async function (req, res) {
    try {
        const id = req.params.id
        let update = { scholarId: null }

        await MintedMonster.findByIdAndUpdate(id, { $set: update }, { new: true })
        res.status(200).json({ message: 'MintedMonster scholar is removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};