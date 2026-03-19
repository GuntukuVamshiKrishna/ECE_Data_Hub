import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthContext from '../context/AuthContext';
import DataContext from '../context/DataContext';
import { FaPlus, FaTrash, FaEdit, FaSearch, FaFileAlt, FaUsers, FaTimes } from 'react-icons/fa';

const AdminProjects = () => {
    const { user } = useContext(AuthContext);
    const { projects, fetchProjects } = useContext(DataContext);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    // Modal to display student details
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [selectedProjectStudents, setSelectedProjectStudents] = useState([]);
    const [selectedProjectTitle, setSelectedProjectTitle] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        documentLink: '',
        students: [{ name: '', rollNumber: '' }, { name: '', rollNumber: '' }, { name: '', rollNumber: '' }, { name: '', rollNumber: '' }]
    });

    const [currentId, setCurrentId] = useState(null);

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    useEffect(() => {
        const results = projects.filter(project =>
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.students.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredProjects(results);
    }, [searchTerm, projects]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStudentChange = (index, e) => {
        const newStudents = [...formData.students];
        newStudents[index][e.target.name] = e.target.value;
        setFormData({ ...formData, students: newStudents });
    };

    const addStudentField = () => {
        setFormData({ ...formData, students: [...formData.students, { name: '', rollNumber: '' }] });
    };

    const removeStudentField = (index) => {
        const newStudents = [...formData.students];
        newStudents.splice(index, 1);
        setFormData({ ...formData, students: newStudents });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Filter out empty student entries before submitting
        const validStudents = formData.students.filter(s => s.name.trim() !== '' && s.rollNumber.trim() !== '');
        if (validStudents.length === 0) {
            toast.error('Please add at least one valid student');
            return;
        }

        const projectData = { ...formData, students: validStudents };

        try {
            if (isEdit) {
                await axios.put(`/api/projects/${currentId}`, projectData, config);
                toast.success('Project updated successfully');
            } else {
                await axios.post('/api/projects', projectData, config);
                toast.success('Project added successfully');
            }
            setShowModal(false);
            resetForm();
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving project');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`/api/projects/${id}`, config);
                toast.success('Project deleted');
                fetchProjects();
            } catch (error) {
                toast.error('Error deleting project');
            }
        }
    };

    const handleEdit = (project) => {
        // Ensure at least 4 student fields exist for editing
        let sList = [...project.students];
        while (sList.length < 4) {
            sList.push({ name: '', rollNumber: '' });
        }
        setFormData({
            title: project.title,
            documentLink: project.documentLink || '',
            students: sList
        });
        setCurrentId(project._id);
        setIsEdit(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            documentLink: '',
            students: [{ name: '', rollNumber: '' }, { name: '', rollNumber: '' }, { name: '', rollNumber: '' }, { name: '', rollNumber: '' }]
        });
        setIsEdit(false);
        setCurrentId(null);
    };

    const openStudentsModal = (project) => {
        // Sort students by roll number before displaying
        const sortedStudents = [...project.students].sort((a, b) => {
            const rollA = String(a.rollNumber || '').trim();
            const rollB = String(b.rollNumber || '').trim();
            return rollA.localeCompare(rollB, undefined, { numeric: true });
        });
        setSelectedProjectStudents(sortedStudents);
        setSelectedProjectTitle(project.title);
        setShowStudentsModal(true);
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar role="admin" />
            <div className="flex-1 ml-0 md:ml-64 w-full overflow-hidden">
                <Navbar title="Manage Projects" />
                <div className="p-4 md:p-8 overflow-y-auto">
                    {/* Header & Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{projects.length}</p>
                        </div>
                    </div>

                    {/* Actions & Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div className="relative w-full md:w-72 mb-4 md:mb-0">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Project or Student..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition duration-200"
                        >
                            <FaPlus className="mr-2" /> Add Project
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Details</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProjects.map((project) => (
                                    <tr key={project._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{project.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button 
                                                onClick={() => openStudentsModal(project)}
                                                className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-md transition-colors"
                                            >
                                                <FaUsers className="mr-2" /> View Members ({project.students.length})
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {project.documentLink ? (
                                                <a href={project.documentLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1" title="Open Document">
                                                    <FaFileAlt size={18} /> <span className="text-sm border-b border-transparent hover:border-indigo-800">Open</span>
                                                </a>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit(project)} className="text-blue-600 hover:text-blue-900 mr-4">
                                                <FaEdit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:text-red-900">
                                                <FaTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProjects.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No projects found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Students View Modal */}
            {showStudentsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h2 className="text-xl font-bold text-gray-800">Team Members: {selectedProjectTitle}</h2>
                            <button onClick={() => setShowStudentsModal(false)} className="text-gray-500 hover:text-red-500"><FaTimes size={20}/></button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            <ul className="divide-y divide-gray-100">
                                {selectedProjectStudents.map((s, i) => (
                                    <li key={i} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded">
                                        <span className="font-semibold text-gray-700">{s.name}</span>
                                        <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-sm">{s.rollNumber}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4 text-right">
                            <button onClick={() => setShowStudentsModal(false)} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Project' : 'Add New Project'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Project Title</label>
                                <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="e.g. AI-based Attendance System" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Document Link (Google Drive)</label>
                                <input name="documentLink" value={formData.documentLink} onChange={handleInputChange} placeholder="https://drive.google.com/..." className="w-full border rounded px-3 py-2" />
                            </div>

                            <div className="mt-6 mb-2 flex justify-between items-center">
                                <label className="block text-gray-700 text-sm font-bold">Team Members</label>
                                <button type="button" onClick={addStudentField} className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center">
                                    <FaPlus className="mr-1" /> Add Student
                                </button>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                {formData.students.map((student, index) => (
                                    <div key={index} className="flex gap-4 mb-3 items-center">
                                        <div className="flex-1">
                                            <input name="name" value={student.name} onChange={(e) => handleStudentChange(index, e)} placeholder="Student Name" className="w-full border rounded px-3 py-2" />
                                        </div>
                                        <div className="flex-1">
                                            <input name="rollNumber" value={student.rollNumber} onChange={(e) => handleStudentChange(index, e)} placeholder="Roll Number" className="w-full border rounded px-3 py-2" />
                                        </div>
                                        {formData.students.length > 1 && (
                                            <button type="button" onClick={() => removeStudentField(index)} className="text-red-500 hover:text-red-700">
                                                <FaTimes />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex justify-end mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{isEdit ? 'Save Changes' : 'Create Project'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProjects;
