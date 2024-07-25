const Department = require("../models/department");

module.exports.addDepartment = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const newDepartment = new Department({
                departmentName: req.body.departmentName,
                departmentHead: req.body.departmentHead,
                departmentEmail: req.body.departmentEmail,
                teamMembers: req.body.teamMembers,
                startingDate: req.body.startingDate,
                status: req.body.status
            });

            const savedDepartment = await newDepartment.save();
            res.status(200).json(savedDepartment);
        } else {
            // User is not an admin, deny access 
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error Creating Project", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.updateDepartment = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const departId = req.params.id;

            // Find the depart by ID
            const department = await Department.findById(departId);

            if (!department) {
                return res.status(404).json({ error: "Department not found" });
            }

            // Update the department information
            department.departmentHead = req.body.departmentHead || department.departmentHead;
            department.departmentEmail = req.body.departmentEmail || department.departmentEmail;

            // Check if req.body.teamMembers exists and is an array
            if (req.body.teamMembers && Array.isArray(req.body.teamMembers)) {
                department.teamMembers = req.body.teamMembers;
            }

            department.status = req.body.status || department.status;

            // Save the updated department
            const updatedDepart = await department.save();
            res.status(200).json(updatedDepart);
        } else {
            // User is not an admin and HR, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error Updating Department", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check if the user making the request is an admin or HR
        if (req.user && (req.user.role === 'Admin' || req.user.role === 'HR')) {
            // Find the department by ID
            const department = await Department.findById(id);

            if (!department) {
                return res.status(404).json({ success: false, message: 'Department not found' });
            }

            // Update the status
            department.status = status;

            // Save the updated department
            await department.save();

            res.status(200).json({ success: true, message: 'Department status updated successfully' });
        } else {
            // User is not an admin or HR, deny access
            res.status(403).json({ success: false, message: 'Access Denied' });
        }
    } catch (error) {
        console.error("Error Updating Department Status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.departmentList = async (req, res) => {
    try {
        let department = await Department.find();
        if (department.length > 0) {
            res.status(200).json(department);
        } else {
            res.status(404).json({ result: "No Department found!" });
        }
    } catch (error) {
        console.error("Error Fetching Department", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}