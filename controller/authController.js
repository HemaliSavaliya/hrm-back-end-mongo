const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require("../models/users");

// module.exports.register = async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         // Check if the user making the request is an admin
//         if (req.user && req.user.role === 'admin') {
//             const newUser = new User({
//                 name, email, password, role: role || "Employee"
//             });

//             const savedUser = await newUser.save();
//             res.status(201).json(savedUser);
//         } else {
//             // User is not an admin,deny access
//             res.status(403).json({ error: 'Access Denied' });
//         }
//     } catch (error) {
//         console.error("Error during registration", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }

module.exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user by email in user collection
        const user = await User.findOne({ email });

        // Find user by email in useremps collection
        const useremps = await Users.findOne({ email });

        // Choose the user document to proceed with based on availability
        const userToAuthenticate = user || useremps;

        // Check if user exists
        if (!userToAuthenticate) {
            return res.status(404).send({ error: "User not found" });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, userToAuthenticate.password);
        if (!passwordMatch) {
            return res.status(401).send({ error: "Invalid password" });
        }

        // Check the user's role matches the specified role in the request
        if (role && userToAuthenticate.role !== role) {
            return res.status(403).send({ error: "Access denied" });
        }

        // Authenticate successfully, generate and return a token
        const token = jwt.sign({ userId: userToAuthenticate._id, role: userToAuthenticate.role }, process.env.JWT_SECRET_KEY);

        res.status(200).json({ data: { token, index: userToAuthenticate.userId, email: userToAuthenticate.email, role: userToAuthenticate.role, id: userToAuthenticate._id, name: userToAuthenticate.name } });

    } catch (error) {
        console.error("Error durning login", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        console.error("Error during logout", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.addHRorEmployee = async (req, res) => {
    try {
        const { role } = req.body;

        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            // Find the latest user to get the current userId
            const latestUser = await User.findOne().sort({ userId: -1 });

            // Increment userId for the new user
            const nextUserId = latestUser ? latestUser.userId + 1 : 1;

            // create a new user and save it to the database
            const newUser = new User({
                userId: nextUserId,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: role || "Employee"
            });

            const savedUser = await newUser.save();

            res.status(201).json(savedUser);
        } else {
            // User is not an admin, deny access 
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error adding HR or Employee", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.userList = async (req, res) => {
    try {
        let userList = await Users.find();
        if (userList.length > 0) {
            res.status(200).json(userList);
        } else {
            res.status(404).json({ results: "No User List Found!" });
        }
    } catch (error) {
        console.error("Error Listing User List", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}