import { useContext } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const Navbar = ({ title }) => {
    const { logout, user } = useContext(AuthContext);

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                    <FaUserCircle className="text-2xl mr-2" />
                    <span className="font-medium">{user?.email}</span>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
                >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
