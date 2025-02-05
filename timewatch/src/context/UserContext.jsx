import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(JSON.parse(userData));
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
            }
        }
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        const userToStore = {
            ...userData,
            userId: userData._id
        };
        localStorage.setItem('userData', JSON.stringify(userToStore));
        setUser(userToStore);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
    };

    const getUserInfos = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return null;
        }
        if (!user) {
            const userData = localStorage.getItem('userData');
            if (userData) {
                try {
                    return JSON.parse(userData);
                } catch {
                    return null;
                }
            }
            return null;
        }
        return user;
    };

    return (
        <UserContext.Provider value={{ user, login, logout, getUserInfos }}>
            {children}
        </UserContext.Provider>
    );
}