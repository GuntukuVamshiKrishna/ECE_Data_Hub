import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthContext from '../context/AuthContext';
import DataContext from '../context/DataContext';
import { FaSearch, FaFileAlt, FaUsers, FaTimes, FaFolder } from 'react-icons/fa';

const UserProjects = () => {
    const { user } = useContext(AuthContext);
    const { projects } = useContext(DataContext);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal to display student details
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [selectedProjectStudents, setSelectedProjectStudents] = useState([]);
    const [selectedProjectTitle, setSelectedProjectTitle] = useState('');

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

    const openStudentsModal = (project) => {
        // Sort students by roll number
        const sortedStudents = [...project.students].sort((a, b) => {
            const rollA = String(a.rollNumber || '').trim();
            const rollB = String(b.rollNumber || '').trim();
            return rollA.localeCompare(rollB, undefined, { numeric: true });
        });
        setSelectedProjectStudents(sortedStudents);
        setSelectedProjectTitle(project.title);
        setShowStudentsModal(true);
    };

    const groupedProjects = filteredProjects.reduce((acc, project) => {
        const batch = project.batch || 'Uncategorized';
        if (!acc[batch]) acc[batch] = [];
        acc[batch].push(project);
        return acc;
    }, {});

    const sortedBatches = Object.keys(groupedProjects).sort((a, b) => a.localeCompare(b));

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar role="user" />
            <div className="flex-1 ml-0 md:ml-64 w-full overflow-hidden">
                <Navbar title="Project Directory (Read Only)" />
                <div className="p-4 md:p-8 overflow-y-auto">
                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                            <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{projects.length}</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div className="relative w-full md:w-72 mb-4 md:mb-0">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Project or Student..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Grouped Projects */}
                    {sortedBatches.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                            No projects found
                        </div>
                    ) : (
                        sortedBatches.map(batchName => (
                            <div key={batchName} className="mb-8">
                                <div className="flex items-center mb-4">
                                    <FaFolder className="text-indigo-500 text-2xl mr-3" />
                                    <h2 className="text-xl font-bold text-gray-800">Batch {batchName}</h2>
                                </div>
                                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Details</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {groupedProjects[batchName].map((project) => (
                                                <tr key={project._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">{project.title}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => openStudentsModal(project)}
                                                            className="flex items-center text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-md transition-colors"
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
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Students View Modal */}
            {showStudentsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h2 className="text-xl font-bold text-gray-800">Team Members: {selectedProjectTitle}</h2>
                            <button onClick={() => setShowStudentsModal(false)} className="text-gray-500 hover:text-red-500"><FaTimes size={20} /></button>
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
                            <button onClick={() => setShowStudentsModal(false)} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProjects;
