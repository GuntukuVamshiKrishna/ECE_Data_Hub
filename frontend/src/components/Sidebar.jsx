import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserGraduate, FaTachometerAlt, FaProjectDiagram, FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800';
    };

    return (
        <>
            {/* Mobile Hamburger Menu */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-3 left-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`bg-gray-900 h-screen w-64 fixed left-0 top-0 flex flex-col text-white transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="h-16 flex items-center justify-center border-b border-gray-800">
                    <h2 className="text-2xl font-bold tracking-wider hidden md:block">Student Data</h2>
                    <h2 className="text-xl font-bold tracking-wider md:hidden ml-8">Student Data</h2>
                </div>

                <div className="flex-1 py-6 overflow-y-auto">
                    <Link onClick={() => setIsOpen(false)} to={role === 'admin' ? '/admin' : '/user'} className={`flex items-center px-6 py-3 mb-2 transition-colors ${isActive(role === 'admin' ? '/admin' : '/user')}`}>
                        <FaTachometerAlt className="mr-3" />
                        Dashboard
                    </Link>
                    {/* Add more links here if needed */}
                    <div className="px-6 py-3 text-gray-400 text-sm uppercase font-semibold mt-4">
                        Management
                    </div>
                    <Link onClick={() => setIsOpen(false)} to={role === 'admin' ? '/admin/students' : '/user/students'} className={`flex items-center px-6 py-3 mb-2 transition-colors ${isActive(role === 'admin' ? '/admin/students' : '/user/students')}`}>
                        <FaUserGraduate className="mr-3" />
                        Students
                    </Link>
                    <Link onClick={() => setIsOpen(false)} to={role === 'admin' ? '/admin/projects' : '/user/projects'} className={`flex items-center px-6 py-3 mb-2 transition-colors ${isActive(role === 'admin' ? '/admin/projects' : '/user/projects')}`}>
                        <FaProjectDiagram className="mr-3" />
                        Projects
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
