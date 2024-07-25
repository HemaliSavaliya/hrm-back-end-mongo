const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    announcementTitle: {
        type: String,
        required: true,
    },
    announcementDetails: {
        type: String,
        required: true,
    },
    selectDepartment: {
        type: String,
        required: true,
    },
    Document: String,
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("announcements", announcementSchema);