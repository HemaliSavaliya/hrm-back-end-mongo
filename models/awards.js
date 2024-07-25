const mongoose = require('mongoose');

const awardsSchema = new mongoose.Schema({
    awardsName: {
        type: String,
        required: true,
    },
    awardsDetails: {
        type: String,
        required: true,
    },
    employeeId: {
        type: Number,
        required: true,
    },
    employeeName: {
        type: String,
        required: true,
    },
    reward: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('awards', awardsSchema);