import { Link, useLocation } from 'react-router-dom';
import { FaUserGraduate, FaTachometerAlt } from 'react-icons/fa';

const Sidebar = ({ role }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800';
    };

    return (
        <div className="bg-gray-900 h-screen w-64 fixed left-0 top-0 flex flex-col text-white transition-all duration-300">
            <div className="h-16 flex items-center justify-center border-b border-gray-800">
                <h2 className="text-2xl font-bold tracking-wider">Student Data</h2>
            </div>

            <div className="flex-1 py-6">
                <Link to={role === 'admin' ? '/admin' : '/user'} className={`flex items-center px-6 py-3 mb-2 transition-colors ${isActive(role === 'admin' ? '/admin' : '/user')}`}>
                    <FaTachometerAlt className="mr-3" />
                    Dashboard
                </Link>
                {/* Add more links here if needed */}
                <div className="px-6 py-3 text-gray-400 text-sm uppercas font-semibold mt-4">
                    Management
                </div>
                <Link to="#" className={`flex items-center px-6 py-3 mb-2 transition-colors text-gray-300 hover:bg-gray-800`}>
                    <FaUserGraduate className="mr-3" />
                    Students
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
