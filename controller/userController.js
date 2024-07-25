const Users = require("../models/users");
const bcrypt = require('bcrypt');
const User = require("../models/user");

module.exports.addEmp = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            // Find the latest user to get the current userId
            const latestUser = await Users.findOne().sort({ userId: -1 });

            // Increment userId for the new user
            const nextUserId = latestUser ? latestUser.userId + 1 : 1;

            const newEmp = new Users({
                addedBy: req.user.name,
                userId: nextUserId,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                department: req.body.department,
                designation: req.body.designation,
                mobileNo: req.body.mobileNo,
                alternateNumber: req.body.alternateNumber,
                address: req.body.address,
                birthDate: req.body.birthDate,
                joiningDate: req.body.joiningDate,
                bloodGroup: req.body.bloodGroup,
                gender: req.body.gender,
                role: req.body.role,
                status: req.body.status,
                salary: req.body.salary,
                bankAccountHolderName: req.body.bankAccountHolderName,
                bankAccountNumber: req.body.bankAccountNumber,
                bankName: req.body.bankName,
                bankIFSCCode: req.body.bankIFSCCode,
                bankBranchLocation: req.body.bankBranchLocation,
                governmentDocument: req.body.governmentDocument
            });

            const savedEmp = await newEmp.save();
            res.status(200).json(savedEmp);
        } else {
            // User is not an admin, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error Creating Employee", error);
        res.status(403).json({ error: "Internal Server Error" });
    }
}

module.exports.updateEmp = async (req, res) => {
    try {
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const userId = req.params.id;
            const updatedEmployee = await Users.updateOne(
                { _id: userId },
                { $set: req.body },
                { new: true }
            )

            if (!updatedEmployee) {
                return res.status(404).json({ error: "Employee Not Found" });
            }

            res.status(200).json(updatedEmployee);
        } else {
            // User is not an admin and HR, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.log("Error Updating Employee", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.deleteEmp = async (req, res) => {
    try {
        const employeeId = req.params.id;

        // Check if the user making the request is an admin or HR
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const employee = await Users.findById(employeeId);

            if (!employee) {
                return res.status(404).json({ error: "Employee Not Found" });
            }

            // Mark the employee as deleted
            employee.deleted = true;
            await employee.save();

            res.status(200).json({ message: "Employee marked as deleted" });
        } else {
            // User is not an admin and HR, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error deleting Employee", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.empList = async (req, res) => {
    try {
        let employee = await Users.find();
        if (employee.length > 0) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ result: "No Employees Found!" });
        }
    } catch (error) {
        console.error("Error Fetching Employees", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.empListById = async (req, res) => {
    try {
        // Retrieve the user ID from the authenticated user
        const userId = req.params.id;

        // Fetch Leave requests for the logged-in-user
        const employeeListById = await Users.findById(userId);

        if (employeeListById) {
            res.status(200).json(employeeListById);
        } else {
            res.status(404).json({ result: "No User Found!" });
        }
    } catch (error) {
        console.error("Error Fetching User List", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.updatePassword = async (req, res) => {
    try {
        const { userId, password, newPassword, confirmPassword } = req.body;

        // Find the user by ID
        const user = await Users.findOne({ _id: userId }); // employee
        const userEmp = await User.findOne({ _id: userId }); // admin

        if (!user && !userEmp) {
            return res.status(404).json({ message: "User not found" });
        }

        let userToUpdate;
        if (user) {
            userToUpdate = user;
        } else {
            userToUpdate = userEmp;
        }

        // Check if newPassword and confirmPassword match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match" });
        }

        if (bcrypt.compareSync(password, userToUpdate.password)) {
            let hashedPassword = bcrypt.hashSync(newPassword, 10);

            await Users.updateOne(
                { _id: userToUpdate.id },
                { password: hashedPassword }
            );

            await User.updateOne(
                { _id: userToUpdate.id },
                { password: hashedPassword }
            );

            // Fetch the updated user document
            const updatedUser = await Users.findOne({ _id: userToUpdate._id });
            const updatedUserEmp = await User.findOne({ _id: userToUpdate._id });

            res.status(200).json({ message: "Password updated successfully", user: updatedUser || updatedUserEmp });
        } else {
            return res.status(400).json({ message: "Password mismatch" });
        }
    } catch (error) {
        console.error("Error Updating password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.forgotPassword = async (req, res) => {
    try {
        // Check if the user making the request is an admin or HR
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const { userId, newPassword, confirmPassword } = req.body;

            // Find the user by ID
            const user = await Users.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check if newPassword and confirmPassword match
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: "New password and confirm password do not match" });
            }

            let hashedPassword = bcrypt.hashSync(newPassword, 10);

            await Users.updateOne(
                { _id: user.id },
                { password: hashedPassword }
            );

            // Fetch the updated user document
            const updatedUser = await Users.findOne({ _id: user._id });

            res.status(200).json({ message: "Password updated successfully", user: updatedUser });
        }
    } catch (error) {
        console.error("Error during change password", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}