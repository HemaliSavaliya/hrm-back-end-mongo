const mongoose = require('mongoose');

const calendarTodosSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("calendartodos", calendarTodosSchema);