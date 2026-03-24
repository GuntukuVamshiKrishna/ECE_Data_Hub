const Project = require('../models/Project');

// @desc    Get projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        let projects = await Project.find().lean();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    if (!req.body.title || !req.body.students || req.body.students.length === 0) {
        res.status(400);
        throw new Error('Please add required fields');
    }

    try {
        const project = await Project.create({
            title: req.body.title,
            students: req.body.students,
            batch: req.body.batch,
            documentLink: req.body.documentLink || ''
        });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(400);
            throw new Error('Project not found');
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(400);
            throw new Error('Project not found');
        }

        await project.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject
};
