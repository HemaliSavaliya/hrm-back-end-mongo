const Designation = require("../models/designation");

module.exports.addDesignation = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            // Convert Date
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthIndex = currentDate.getMonth() + 1;
            const monthAbbreviation = monthNames[monthIndex - 1];
            const day = currentDate.getDate();
            const todayDate = `${day < 10 ? '0' : ''}${day} ${monthAbbreviation} ${year}`;

            const newDesignation = new Designation({
                designationName: req.body.designationName,
                startingDate: todayDate,
                status: req.body.status
            });

            const savedDesignation = await newDesignation.save();
            res.status(200).json(savedDesignation);
        } else {
            // User is not an admin or HR, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error creating designation", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            // Find the designation by ID
            const designation = await Designation.findById(id);

            if (!designation) {
                return res.status(404).json({ success: false, message: "Designation not found" });
            }

            // Update the status
            designation.status = status;

            // Save the updated designation
            await designation.save();

            res.status(200).json({ success: true, message: "Designation status updated successfully" });
        } else {
            // User is not an admin or HR, deny access
            res.status(403).json({ success: false, message: "Access denied" });
        }

    } catch (error) {
        console.error("Error Updating designation status", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.designationList = async (req, res) => {
    try {
        let designation = await Designation.find();
        if (designation.length > 0) {
            res.status(200).json(designation);
        } else {
            res.status(404).json({ result: "No Designation found!" });
        }
    } catch (error) {
        console.error("Error Fetching designation", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}