const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Users = require('../models/users');

module.exports.authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Token not provided" });
        }

        // Verify the token using the JWT_SECRET_KEY
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decodedToken) {
            return res.status(401).json({ error: "Invalid token" });
        }

        // Check the role and find the user accordingly
        let user;
        if (decodedToken.role === "Admin") {
            user = await User.findById(decodedToken.userId);
        } else {
            user = await Users.findById(decodedToken.userId);
        }

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Attach the user object to the request for further use
        req.user = user;
        next();
    } catch (error) {
        console.error("Error during authentication", error);
        res.status(401).json({ error: "Invalid token" });
    }
}