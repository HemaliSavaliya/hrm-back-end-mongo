const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
    },
    departmentHead: {
        type: String,
        required: true,
    },
    departmentEmail: {
        type: String,
        required: true,
        unique: true
    },
    teamMembers: {
        type: [String],
        required: true,
    },
    startingDate: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive"]
    }
});

module.exports = mongoose.model("departments", departmentSchema);