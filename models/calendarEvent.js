const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    start: {
        type: String,
        required: true
    },
    end: String,
    todoId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("calendarevents", calendarEventSchema);