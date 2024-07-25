const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
    addedBy: {
        type: String,
        required: true
    },
    userId: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: Number,
        required: true,
    },
    alternateNumber: Number,
    address: String,
    birthDate: {
        type: String,
        required: true,
    },
    joiningDate: {
        type: String,
        required: true,
    },
    bloodGroup: String,
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },
    role: {
        type: String,
        required: true,
        enum: ["Employee", "HR"],
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive"],
    },
    salary: {
        type: String,
        required: true,
    },
    bankAccountHolderName: {
        type: String,
        required: true,
    },
    bankAccountNumber: {
        type: Number,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    bankIFSCCode: {
        type: String,
        required: true,
    },
    bankBranchLocation: {
        type: String,
        required: true
    },
    governmentDocument: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

// Hash password before saving to the database
usersSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
})

module.exports = mongoose.model("useremps", usersSchema);