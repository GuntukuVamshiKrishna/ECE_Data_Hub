import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else navigate('/user');
        }
    }, [user, navigate]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/auth/login', formData);
            if (response.data) {
                login(response.data);
                toast.success('Logged in successfully');
            }
        } catch (error) {
            const message = error.response?.data?.message
                || (error.message === 'Network Error' ? 'Backend not running? Check server.' : 'Login failed');
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="email"
                            name="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="password"
                            name="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    {/* <p>Default Admin: admin@gmail.com / Admin@123</p>
                    <p>Default User: user@gmail.com / User@123</p> */}
                </div>
            </div>
        </div>
    );
};

export default Login;
