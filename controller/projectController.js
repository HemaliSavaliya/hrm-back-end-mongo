const Project = require("../models/projects");

module.exports.addProjects = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && req.user.role === "Admin") {
            // Find the latest user to get the current projectId
            const latestProject = await Project.findOne().sort({ projectId: -1 });

            // Increment projectId for the new user
            const nextProjectId = latestProject ? latestProject.projectId + 1 : 1;

            const newProjects = new Project({
                projectId: nextProjectId,
                projectName: req.body.projectName,
                clientName: req.body.clientName,
                clientEmail: req.body.clientEmail,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                status: req.body.status,
                teamMembers: req.body.teamMembers.map(member => member.name), // Store only names in teamMembers
                userId: req.body.teamMembers.map(member => member.userId), // Store only userIds in userIds
                document: req.body.document,
            });

            const savedProject = await newProjects.save();
            res.status(200).json(savedProject);
        } else {
            // User is not an admin, deny access 
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error Creating Project", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        // Check if the user making the request is an admin
        if (req.user && req.user.role === "Admin") {
            const project = await Project.findById(projectId);

            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            // Mark the project as deleted
            project.deleted = true;
            await project.save();

            res.status(200).json({ message: "Project marked as deleted" });
        } else {
            // User is not an admin, deny access
            res.status(403).json({ error: 'Access denied' });
        }

    } catch (error) {
        console.error("Error deleting Project", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.updateProject = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && req.user.role === "Admin") {
            const projectId = req.params.id;

            // Find the project by ID
            const project = await Project.findById(projectId);

            if (!project) {
                return res.status(404).json({ error: "Project not found" });
            }

            // Update the project information
            project.clientEmail = req.body.clientEmail || project.clientEmail;
            project.endDate = req.body.endDate || project.endDate;
            project.status = req.body.status || project.status;
            project.teamMembers = req.body.teamMembers.map(member => member.name) || project.teamMembers;
            project.userId = req.body.teamMembers.map(member => member.userId) || project.userId;

            // Save the updated Project
            const updatedProject = await project.save();
            res.status(200).json(updatedProject);
        } else {
            // User is not an admin, deny access
            res.status(403).json({ error: 'Access denied' });
        }

    } catch (error) {
        console.error("Error Updating Project", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check if the user making the request is an admin
        if (req.user && req.user.role === "Admin") {
            // Find the Project Id
            const project = await Project.findById(id);

            if (!project) {
                return res.status(404).json({ success: false, message: "Project not found" });
            }

            // Update the status
            project.status = status;

            // Save the updated project
            await project.save();

            res.status(200).json({ success: true, message: "Project status updated successfully" });
        } else {
            // User is not an admin, deny access
            res.status(403).json({ success: false, message: "Access denied" });
        }
    } catch (error) {
        console.error("Error Updating Project Status", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.projectsList = async (req, res) => {
    try {
        const { role, userId } = req.user;

        let projects;

        if (role === "Admin") {
            projects = await Project.find();
        } else if (role === "Employee") {
            projects = await Project.find({ userId: userId, status: "Active" });
        }

        if (projects.length > 0) {
            res.status(200).json(projects);
        } else {
            res.status(404).json({ result: "No Projects found!" });
        }
    } catch (error) {
        console.error("Error Fetching Projects:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};