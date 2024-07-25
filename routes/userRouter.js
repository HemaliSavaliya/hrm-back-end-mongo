const { addEmp, empList, updateEmp, deleteEmp, empListById, updatePassword, forgotPassword } = require('../controller/userController');
const { authenticate } = require('../utils/authMiddleware');
const router = require('express').Router();

router.post("/add-emp", addEmp);
router.post("/update-password", authenticate, updatePassword);
router.post("/forgot-password", authenticate, forgotPassword);
router.put("/update-emp/:id", authenticate, updateEmp);
router.delete("/delete-emp/:id", authenticate, deleteEmp);
router.get("/empList", authenticate, empList);
router.get("/profile/:id", authenticate, empListById);

module.exports = router;