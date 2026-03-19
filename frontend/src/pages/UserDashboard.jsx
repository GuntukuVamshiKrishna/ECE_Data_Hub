import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthContext from '../context/AuthContext';
import { FaGraduationCap } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('/api/students', config);
            setStudents(response.data);
        } catch (error) {
            toast.error('Error fetching students');
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar role="user" />
            <div className="flex-1 ml-0 md:ml-64 w-full overflow-hidden">
                <Navbar title="Student Dashboard" />
                <div className="p-4 md:p-8 overflow-y-auto">
                    {/* Welcome Text */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Welcome back, Student!</h1>
                        <p className="text-gray-600 mt-2">Here is your quick overview of the data hub.</p>
                    </div>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-500 text-sm font-medium">Total Enrolled Students</h3>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">{students.length}</p>
                                </div>
                                <FaGraduationCap className="text-indigo-500 text-4xl opacity-50" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                            <h3 className="text-gray-500 text-sm font-medium">Welcome</h3>
                            <p className="text-lg text-gray-600 mt-2">Use the side menu to view the full directories.</p>
                        </div>
                    </div>
                    
                    {/* Placeholder */}
                    <div className="bg-white rounded-lg shadow-md p-6 h-64 flex flex-col items-center justify-center border border-gray-100">
                        <p className="text-gray-500 font-medium">Navigate to the Students or Projects section to view detailed lists.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
