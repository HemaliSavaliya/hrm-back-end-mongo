const LeaveType = require("../models/leaveType");

module.exports.addLeaveType = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const newLeaveType = new LeaveType({
                leaveName: req.body.leaveName,
                leaveBalance: req.body.leaveBalance,
                leaveStatus: req.body.leaveStatus,
                leaveAddingDate: req.body.leaveAddingDate
            });

            const savedLeaveType = await newLeaveType.save();
            res.status(200).json(savedLeaveType);
        }
    } catch (error) {
        console.error("Error Creating Leave Type", error);
        res.status(403).json({ error: "Internal Server Error" });
    }
}

module.exports.updateLeaveType = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const updatedLeaveType = await LeaveType.updateOne(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )

            if (!updatedLeaveType) {
                return res.status(404).json({ error: "Leave type not found" });
            }

            res.status(200).json(updatedLeaveType);
        } else {
            // User is not an admin and HR, deny access
            res.status(403).json({ error: "Access denied" });
        }
    } catch (error) {
        console.log("Error updating Leave Type", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.deleteLeaveType = async (req, res) => {
    try {
        const leaveTypeId = req.params.id;

        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const leaveType = await LeaveType.findById(leaveTypeId);

            if (!leaveType) {
                return res.status(404).json({ error: "Leave type not found" });
            }

            // Mark the LeaveType as deleted
            leaveType.deleted = true;
            await leaveType.save();

            res.status(200).json({ message: "Leave marked as deleted" });
        } else {
            // User is not an admin, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error deleting Leave Type", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { leaveStatus } = req.body;

        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            // Find the leave status id
            const leave = await LeaveType.findById(id);

            if (!leave) {
                return res.status(404).json({ success: false, message: "Leave Type not found" });
            }

            // Update the leave status
            leave.leaveStatus = leaveStatus;

            // Save the updated leave status
            await leave.save();

            res.status(200).json({ success: true, message: "Leave Status updated successfully" });
        } else {
            // User is not an admin, deny access
            res.status(403).json({ success: false, message: "Access Denied" });
        }
    } catch (error) {
        console.error("Error Updating Leave type Status", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.leaveTypeList = async (req, res) => {
    try {
        let leaveType = await LeaveType.find();
        if (leaveType.length > 0) {
            res.status(200).json(leaveType);
        } else {
            res.status(404).json({ result: "No Leave Type Found!" });
        }
    } catch (error) {
        console.error("Error Fetching Leave Type", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}