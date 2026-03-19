import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthContext from '../context/AuthContext';
import DataContext from '../context/DataContext';
import { FaGraduationCap, FaBook, FaCalendarDay } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const { students } = useContext(DataContext);

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar role="admin" />
            <div className="flex-1 ml-0 md:ml-64 w-full overflow-hidden">
                <Navbar title="Admin Dashboard" />
                <div className="p-4 md:p-8 overflow-y-auto">
                    {/* Welcome Text */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Welcome back, Admin!</h1>
                        <p className="text-gray-600 mt-2">Here is a quick overview of the student data hub.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">{students.length}</p>
                                </div>
                                <FaGraduationCap className="text-blue-500 text-4xl opacity-50" />
                            </div>
                        </div>
                        {/* Dynamic stats */}
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-500 text-sm font-medium">Active Courses</h3>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">
                                        {[...new Set(students.map(s => s.course))].length}
                                    </p>
                                </div>
                                <FaBook className="text-green-500 text-4xl opacity-50" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
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
                                <FaCalendarDay className="text-purple-500 text-4xl opacity-50" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Placeholder for future charts or activity feed */}
                    <div className="bg-white rounded-lg shadow-md p-6 h-64 flex flex-col items-center justify-center border border-gray-100">
                        <p className="text-gray-500 font-medium">Use the left sidebar to manage students and projects.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
