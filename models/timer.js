const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
    date: {
        type: String,
    },
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    projectName: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    resumeTime: {
        type: String,
    },
    pauseTime: {
        type: String,
    },
    stopTime: {
        type: String,
        required: true,
    },
    hours: {
        type: Number,
        required: true,
    },
    minutes: {
        type: Number,
        required: true,
    },
    seconds: {
        type: Number,
        required: true,
    },
    totalHours: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Present", "Late", "Absent"],
        default: "Absent"
    }
});

module.exports = mongoose.model("timers", timerSchema);