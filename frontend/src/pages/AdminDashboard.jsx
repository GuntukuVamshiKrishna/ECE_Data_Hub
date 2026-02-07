import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthContext from '../context/AuthContext';
import { FaPlus, FaTrash, FaEdit, FaSearch } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: '',
        phone: '',
        course: '',
        year: ''
    });

    const [currentId, setCurrentId] = useState(null);

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        const results = students.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(results);
    }, [searchTerm, students]);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('/api/students', config);
            setStudents(response.data);
            setFilteredStudents(response.data);
        } catch (error) {
            toast.error('Error fetching students');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`/api/students/${currentId}`, formData, config);
                toast.success('Student updated successfully');
            } else {
                await axios.post('/api/students', formData, config);
                toast.success('Student added successfully');
            }
            setShowModal(false);
            resetForm();
            fetchStudents();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving student');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`/api/students/${id}`, config);
                toast.success('Student deleted');
                fetchStudents();
            } catch (error) {
                toast.error('Error deleting student');
            }
        }
    };

    const handleEdit = (student) => {
        setFormData({
            name: student.name,
            rollNumber: student.rollNumber,
            email: student.email,
            phone: student.phone,
            course: student.course,
            year: student.year
        });
        setCurrentId(student._id);
        setIsEdit(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            rollNumber: '',
            email: '',
            phone: '',
            course: '',
            year: ''
        });
        setIsEdit(false);
        setCurrentId(null);
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar role="admin" />
            <div className="flex-1 ml-64">
                <Navbar title="Admin Dashboard" />
                <div className="p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{students.length}</p>
                        </div>
                        {/* Dynamic stats */}
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                            <h3 className="text-gray-500 text-sm font-medium">Active Courses</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {[...new Set(students.map(s => s.course))].length}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                            <h3 className="text-gray-500 text-sm font-medium">New Admissions (30d)</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {students.filter(s => {
                                    const joinDate = new Date(s.createdAt);
                                    const thirtyDaysAgo = new Date();
                                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                    return joinDate > thirtyDaysAgo;
                                }).length}
                            </p>
                        </div>
                    </div>

                    {/* Actions & Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div className="relative w-full md:w-96 mb-4 md:mb-0">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Name or Roll Number..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition duration-200"
                        >
                            <FaPlus className="mr-2" /> Add Student
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{student.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.course}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.year}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{student.email}</div>
                                            <div className="text-xs">{student.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-900 mr-4">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(student._id)} className="text-red-600 hover:text-red-900">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No students found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Roll Number</label>
                                    <input required name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Course</label>
                                    <input required name="course" value={formData.course} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                                    <input required name="year" value={formData.year} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{isEdit ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
