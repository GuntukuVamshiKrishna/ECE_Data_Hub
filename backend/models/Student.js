const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    rollNumber: {
        type: String,
        required: [true, 'Please add a roll number'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    course: {
        type: String,
        required: [true, 'Please add a course']
    },
    year: {
        type: String,
        required: [true, 'Please add a year']
    },
    documentLink: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
