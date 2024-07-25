const { addProjects, projectsList, updateProject, deleteProject, updateStatus } = require("../controller/projectController");
const { authenticate } = require('../utils/authMiddleware');
const router = require('express').Router();

router.post('/add-projects', authenticate, addProjects);
router.put('/project/:id', authenticate, updateProject);
router.put('/update-status/:id', authenticate, updateStatus);
router.delete('/delete-project/:id', authenticate, deleteProject);
router.get('/projects-list', authenticate, projectsList);

module.exports = router;