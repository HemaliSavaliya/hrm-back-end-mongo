const { addAwards, awardsList, updateAwards, deleteAwards } = require('../controller/awardsController');
const { authenticate } = require('../utils/authMiddleware');
const router = require('express').Router();

router.post("/add-awards", addAwards);
router.put("/update-awards/:id", updateAwards);
router.delete("/delete-awards/:id", deleteAwards);
router.get("/awardsList", awardsList);

module.exports = router;