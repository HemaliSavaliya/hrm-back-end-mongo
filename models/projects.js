const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectId: {
        type: Number,
        unique: true
    },
    projectName: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    clientEmail: String,
    startDate: {
        type: String,
        required: true
    },
    endDate: String,
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive"]
    },
    userId: {
        type: [String],
    },
    teamMembers: {
        type: [String],
        required: true
    },
    document: String,
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("projects", projectSchema);