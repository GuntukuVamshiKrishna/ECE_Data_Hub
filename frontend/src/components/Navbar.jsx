import { useContext } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const Navbar = ({ title }) => {
    const { logout, user } = useContext(AuthContext);

    return (
        <nav className="bg-white shadow-sm px-4 md:px-6 py-4 flex flex-col gap-4 sm:flex-row justify-between items-center z-10 relative">
            <h1 className="text-xl font-bold text-gray-800 w-full text-center sm:text-left ml-0 sm:ml-12 md:ml-0">{title}</h1>
            <div className="flex items-center justify-center sm:justify-end w-full space-x-4">
                <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <FaUserCircle className="text-xl md:text-2xl mr-2 text-blue-500" />
                    <span className="font-medium text-sm md:text-base">{user?.email?.split('@')[0]}</span>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center bg-red-50 hover:bg-red-500 text-red-600 hover:text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition duration-200 border border-red-100 hover:border-transparent text-sm md:text-base font-medium"
                >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
