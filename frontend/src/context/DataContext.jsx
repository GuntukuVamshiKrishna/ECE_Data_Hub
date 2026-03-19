import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [projects, setProjects] = useState([]);

    // Fetch Students
    const fetchStudents = async () => {
        if (!user) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const response = await axios.get('/api/students', config);
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    // Fetch Projects
    const fetchProjects = async () => {
        if (!user) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const response = await axios.get('/api/projects', config);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    // Auto-fetch exactly once when the user successfully logs in
    useEffect(() => {
        if (user) {
            fetchStudents();
            fetchProjects();
        } else {
            // Clear memory when logged out
            setStudents([]);
            setProjects([]);
        }
    }, [user]);

    return (
        <DataContext.Provider value={{ students, projects, fetchStudents, fetchProjects }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
