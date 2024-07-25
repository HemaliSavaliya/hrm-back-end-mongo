const mongoose = require('mongoose');

const applicantListSchema = new mongoose.Schema({
    applicantName: {
        type: String,
        required: true,
    },
    applicantEmail: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    cv: {
        type: String,
        // required: true,
    }
});

module.exports = mongoose.model("applicantLists", applicantListSchema);