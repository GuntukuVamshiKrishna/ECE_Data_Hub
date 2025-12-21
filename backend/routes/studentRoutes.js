const express = require('express');
const router = express.Router();
const {
    getStudents,
    setStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getStudents).post(protect, admin, setStudent);
router.route('/:id').delete(protect, admin, deleteStudent).put(protect, admin, updateStudent);

module.exports = router;
