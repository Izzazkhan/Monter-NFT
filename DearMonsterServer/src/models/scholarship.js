const mongoose = require('mongoose');

const ScholarshipSchema = new mongoose.Schema({
    scholarWallet: {
        type: String
    },
    scholarName: {
        type: String
    },
    managerName: {
        type: String
    },
    profitShare: {
        Manager_Share: {
            type: Number
        },
        Scholar_Share: {
            type: Number
        }
    },
    readMe: {
        type: String
    },
    assigned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = mongoose.model('Scholarship', ScholarshipSchema);