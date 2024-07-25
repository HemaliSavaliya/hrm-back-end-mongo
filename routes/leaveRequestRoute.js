const { addLeaveRequest, updateLeaveReqStatus, leaveRequestList, leaveRequestListRoleWise, fetchLeaveData } = require('../controller/leaveRequestController');
const { authenticate } = require('../utils/authMiddleware');
const router = require('express').Router();

router.post("/add-leaveRequest", authenticate, addLeaveRequest);
router.put("/update-leave-status", authenticate, updateLeaveReqStatus);
router.get("/leaveRequestList", authenticate, leaveRequestList);
router.get("/leaveRequestListRoleWise", authenticate, leaveRequestListRoleWise);
router.get("/leaveBalance", authenticate, fetchLeaveData);

module.exports = router;