const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userIndex: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        required: true,
    },
    leaveType: {
        type: String,
        required: true,
        enum: ["Full Day", "Half Day"]
    },
    leaveName: {
        type: String,
        required: true
    },
    applyingDate: {
        type: String,
    },
    totalDays: {
        type: Number,
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Approved", "Rejected", "Pending"],
        default: "Pending"
    },
    entitled: {
        type: Number,
    },
    utilized: {
        type: Number,
        default: 0
    },
    balanced: {
        type: Number,
    },
    carriedForward: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("leaverequests", leaveRequestSchema);