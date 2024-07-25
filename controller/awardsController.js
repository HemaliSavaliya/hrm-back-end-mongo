const Awards = require("../models/awards");
const Users = require("../models/users");

module.exports.addAwards = async (req, res) => {
    try {
        // // Check if the user making the request is an admin or HR
        // if (!req.user || (req.user.role !== "Admin" && req.user.role !== "HR")) {
        //     return res.status(403).json({ error: "Access Denied" });
        // }

        // Check if the provided employeeId and employeeName exist in the users collection or not
        const userExists = await Users.findOne({
            userId: req.body.employeeId,
            name: req.body.employeeName,
        });

        if (!userExists) {
            // If the user doesn't exist, return an error
            return res.status(404).json({ error: "Invalid employeeId or employeeName" });
        }

        // Check if an award with the same employeeName and employeeId already exists
        const existingAward = await Awards.findOne({
            employeeId: userExists.userId,
            employeeName: userExists.name,
            awardsName: req.body.awardsName,
        });

        if (existingAward) {
            // If an award already exists for the same employee, return an error
            return res.status(400).json({ error: "Employee already has this award" });
        }

        // If the user exists and no existing award, proceed to save the award
        const newAwards = new Awards({
            awardsName: req.body.awardsName,
            awardsDetails: req.body.awardsDetails,
            employeeId: userExists.userId,
            employeeName: userExists.name,
            reward: req.body.reward
        });

        const savedAwards = await newAwards.save();
        res.status(200).json(savedAwards);
    } catch (error) {
        console.error("Error Creating awards", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.updateAwards = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        // if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const updatedAwards = await Awards.updateOne(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )

            if (!updatedAwards) {
                return res.status(404).json({ error: "Awards not found" });
            }

            res.status(200).json(updatedAwards);
        // } else {
        //     // User is not an admin or HR, deny access
        //     res.status(403).json({ error: "Access Denied" });
        // }
    } catch (error) {
        console.error("Error updating awards", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.deleteAwards = async (req, res) => {
    try {
        const awardId = req.params.id;

        // Check if the user making the request is an admin
        // if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const award = await Awards.findById(awardId);

            if (!award) {
                return res.status(404).json({ error: "Awards not found" });
            }

            // Mark the award as deleted
            award.deleted = true;
            await award.save();

            res.status(200).json({ message: "Awards marked as deleted" });
        // } else {
        //     // User is not an admin and HR, deny access
        //     res.status(403).json({ error: "Access denied" });
        // }
    } catch (error) {
        console.error("Error deleting awards", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.awardsList = async (req, res) => {
    try {
        let awards = await Awards.find();
        if (awards.length > 0) {
            res.status(200).json(awards);
        } else {
            res.status(404).json({ results: "No Awards Found!" });
        }
    } catch (error) {
        console.error("Error Listing awards", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}