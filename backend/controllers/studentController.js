const Student = require('../models/Student');

// @desc    Get students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set student
// @route   POST /api/students
// @access  Private/Admin
const setStudent = async (req, res) => {
    if (!req.body.name || !req.body.rollNumber) {
        res.status(400);
        throw new Error('Please add required fields');
    }

    try {
        const student = await Student.create({
            name: req.body.name,
            rollNumber: req.body.rollNumber,
            email: req.body.email,
            phone: req.body.phone,
            course: req.body.course,
            year: req.body.year,
            documentLink: req.body.documentLink
        });
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            res.status(400);
            throw new Error('Student not found');
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            res.status(400);
            throw new Error('Student not found');
        }

        await student.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getStudents,
    setStudent,
    updateStudent,
    deleteStudent
};
