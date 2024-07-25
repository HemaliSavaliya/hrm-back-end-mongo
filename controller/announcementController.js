const Announcements = require("../models/announcement");

module.exports.addAnnouncement = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const newAnnouncement = new Announcements({
                announcementTitle: req.body.announcementTitle,
                announcementDetails: req.body.announcementDetails,
                selectDepartment: req.body.selectDepartment,
                Document: req.body.document
            });

            const savedAnnouncement = await newAnnouncement.save();
            res.status(200).json(savedAnnouncement);
        } else {
            // User is not an admin, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error Creating announcement", error);
        res.status(403).json({ error: "Internal Server Error" });
    }
}

module.exports.updateAnnouncement = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const updatedAnnouncement = await Announcements.updateOne(
                { _id: req.params.id },
                { $set: req.body },
                { new: true },
            )

            if (!updatedAnnouncement) {
                return res.status(404).json({ error: "Announcement not found" });
            }

            res.status(200).json(updatedAnnouncement);
        } else {
            // User is not an admin, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error updating announcement", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcementId = req.params.id;

        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const announcement = await Announcements.findById(announcementId);

            if (!announcement) {
                return res.status(404).json({ error: "Announcement Data not found" });
            }

            // Mark the announcement as deleted
            announcement.deleted = true;
            await announcement.save();

            res.status(200).json({ message: "Announcement marked as deleted" });
        } else {
            // User is not an admin, deny access
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (error) {
        console.error("Error deleting announcement", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.announcementList = async (req, res) => {
    try {
        let announcement = await Announcements.find();
        if (announcement.length > 0) {
            res.status(200).json(announcement);
        } else {
            res.status(404).json({ result: "No Announcements Found!" });
        }
    } catch (error) {
        console.error("Error Fetching announcement", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}