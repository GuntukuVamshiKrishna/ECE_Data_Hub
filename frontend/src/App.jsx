import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import AdminProjects from './pages/AdminProjects';
import UserProjects from './pages/UserProjects';
import AdminStudents from './pages/AdminStudents';
import UserStudents from './pages/UserStudents';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <>
            <Router>
                <AuthProvider>
                    <DataProvider>
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
                            
                            <Route path="/admin/students" element={
                                <ProtectedRoute role="admin">
                                    <AdminStudents />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/projects" element={
                                <ProtectedRoute role="admin">
                                    <AdminProjects />
                                </ProtectedRoute>
                            } />

                            <Route path="/user" element={
                                <ProtectedRoute role="user">
                                    <UserDashboard />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/user/students" element={
                                <ProtectedRoute role="user">
                                    <UserStudents />
                                </ProtectedRoute>
                            } />

                            <Route path="/user/projects" element={
                                <ProtectedRoute role="user">
                                    <UserProjects />
                                </ProtectedRoute>
                            } />

                        </Routes>
                    </div>
                    </DataProvider>
                </AuthProvider>
            </Router>
            <ToastContainer />
        </>
    );
}

export default App;
