const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    noOfPosition: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("jobs", jobsSchema);