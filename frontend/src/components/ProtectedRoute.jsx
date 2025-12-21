import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        // Redirect based on their actual role if they try to access wrong dashboard
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        return <Navigate to="/user" replace />;
    }

    return children;
};

export default ProtectedRoute;
