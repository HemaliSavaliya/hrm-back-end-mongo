const { addAnnouncement, announcementList, updateAnnouncement, deleteAnnouncement } = require('../controller/announcementController');
const { authenticate } = require('../utils/authMiddleware');
const router = require('express').Router();

router.post("/add-announcement", authenticate, addAnnouncement);
router.put("/announcement/:id", authenticate, updateAnnouncement);
router.delete("/announcement/:id", authenticate, deleteAnnouncement);
router.get("/announcementList", authenticate, announcementList);

module.exports = router;