const mongoose = require('mongoose');

const leaveTypeSchema = new mongoose.Schema({
    leaveName: {
        type: String,
        required: true,
        unique: true
    },
    leaveBalance: {
        type: String,
        required: true
    },
    leaveStatus: {
        type: String,
        required: true,
        enum: ["Active", "Inactive"]
    },
    leaveAddingDate: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("leavetypes", leaveTypeSchema);