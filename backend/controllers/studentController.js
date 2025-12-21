const Student = require('../models/Student');

// @desc    Get students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
    const students = await Student.find();
    res.status(200).json(students);
};

// @desc    Set student
// @route   POST /api/students
// @access  Private/Admin
const setStudent = async (req, res) => {
    if (!req.body.name || !req.body.rollNumber) {
        res.status(400).json({ message: 'Please add required fields' });
        return;
    }

    const student = await Student.create({
        name: req.body.name,
        rollNumber: req.body.rollNumber,
        email: req.body.email,
        phone: req.body.phone,
        course: req.body.course,
        year: req.body.year
    });

    res.status(200).json(student);
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(400).json({ message: 'Student not found' });
        return;
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedStudent);
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(400).json({ message: 'Student not found' });
        return;
    }

    await student.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getStudents,
    setStudent,
    updateStudent,
    deleteStudent
};
