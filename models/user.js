const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 100
    },
    role: {
        type: String,
        enum: ["Employee", "HR", "Admin"],
        default: "Employee"
    },
    governmentDocument: String
});

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
})

module.exports = mongoose.model("users", userSchema);