const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
    designationName: {
        type: String,
        required: true
    },
    startingDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive"]
    }
});

module.exports = mongoose.model('designations', designationSchema);