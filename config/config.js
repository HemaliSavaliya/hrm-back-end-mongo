const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongoose connection established", conn.connection.host);
    } catch (error) {
        console.log("Error connecting to Mongoose");
    }
}

module.exports = connectDB;

// mongodb+srv://defaultstackholic:H54JGHCtbUopRaVU@cluster0.e0reyf2.mongodb.net/HRM-DASHBOARD