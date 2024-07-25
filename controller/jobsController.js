const Jobs = require("../models/jobs");

module.exports.addJob = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const newJobs = new Jobs({
                jobTitle: req.body.jobTitle,
                position: req.body.position,
                department: req.body.department,
                noOfPosition: req.body.noOfPosition,
                jobDescription: req.body.jobDescription
            });

            const savedJobs = await newJobs.save();
            res.status(200).json(savedJobs);
        } else {
            // User is not an admin, deny access 
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error Creating Job", error);
        res.status(403).json({ error: "Internal Server Error" });
    }
}

module.exports.updateJob = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const updatedJob = await Jobs.updateOne(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )

            if (!updatedJob) {
                return res.status(404).json({ error: "Job not found" });
            }

            res.status(200).json(updatedJob);
        } else {
            // User is not an admin, deny access
            res.status(403).json({ error: 'Access denied' });
        }

    } catch (error) {
        console.error("Error Updating Job", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.deleteJobs = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const job = await Jobs.findById(jobId);

            if (!job) {
                return res.status(404).json({ error: "Job not found" });
            }

            // Mark the job as deleted
            job.deleted = true;
            await job.save();

            res.status(200).json({ message: "Jobs marked as deleted" });
        } else {
            // User is not an admin, deny access
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (error) {
        console.error("Error deleting Jobs", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.jobsList = async (req, res) => {
    try {
        let job = await Jobs.find();
        if (job.length > 0) {
            res.status(200).json(job);
        } else {
            res.status(404).json({ result: "No Jobs Found!" });
        }
    } catch (error) {
        console.error("Error Fetching Jobs", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}