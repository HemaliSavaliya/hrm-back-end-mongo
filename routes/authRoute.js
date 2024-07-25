const { login, addHRorEmployee, logout, userList } = require("../controller/authController");
const { authenticate } = require('../utils/authMiddleware');
const router = require('express').Router();

// router.post('/register', register);
router.post('/login', login);
router.get('/user-list', authenticate, userList);
router.post('/logout', logout); // Use the authenticate middleware to logout
router.post('/add-hr-employee', authenticate, addHRorEmployee);

module.exports = router;