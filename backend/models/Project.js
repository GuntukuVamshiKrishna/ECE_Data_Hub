const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a project title']
    },
    students: [
        {
            name: { type: String, required: true },
            rollNumber: { type: String, required: true }
        }
    ],
    documentLink: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
