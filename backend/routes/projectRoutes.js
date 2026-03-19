const express = require('express');
const router = express.Router();
const {
    getProjects,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProjects).post(protect, admin, createProject);
router.route('/:id').delete(protect, admin, deleteProject).put(protect, admin, updateProject);

module.exports = router;
