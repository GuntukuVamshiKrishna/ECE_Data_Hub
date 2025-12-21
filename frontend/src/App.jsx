import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <>
            <Router>
                <AuthProvider>
                    <div className="container mx-auto">
                        <Routes>
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/login" element={<Login />} />

                            {/* Protected Routes */}
                            <Route path="/admin" element={
                                <ProtectedRoute role="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />

                            <Route path="/user" element={
                                <ProtectedRoute role="user">
                                    <UserDashboard />
                                </ProtectedRoute>
                            } />

                        </Routes>
                    </div>
                </AuthProvider>
            </Router>
            <ToastContainer />
        </>
    );
}

export default App;
