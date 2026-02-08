import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('agriGuardUser');
            if (storedUser) {
                await new Promise(resolve => setTimeout(resolve, 500));
                setUser(JSON.parse(storedUser));
            }

            // Initialize users database if not exists
            if (!localStorage.getItem('agriGuardUsers')) {
                localStorage.setItem('agriGuardUsers', JSON.stringify([
                    { email: 'farmer@agri.com', password: 'password123', name: 'Juan Dela Cruz', joined: new Date().toISOString() }
                ]));
            }

            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const users = JSON.parse(localStorage.getItem('agriGuardUsers') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('agriGuardUser', JSON.stringify(foundUser));
            setLoading(false);
            return true;
        }

        setLoading(false);
        throw new Error('Invalid credentials');
    };

    const signup = async (userData) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const users = JSON.parse(localStorage.getItem('agriGuardUsers') || '[]');
        if (users.find(u => u.email === userData.email)) {
            setLoading(false);
            throw new Error('User already exists');
        }

        const newUser = {
            ...userData,
            joined: new Date().toISOString(),
            id: 'farmer_' + Math.floor(Math.random() * 10000)
        };

        users.push(newUser);
        localStorage.setItem('agriGuardUsers', JSON.stringify(users));
        setUser(newUser);
        localStorage.setItem('agriGuardUser', JSON.stringify(newUser));
        setLoading(false);
        return true;
    };

    const logout = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setUser(null);
        localStorage.removeItem('agriGuardUser');
        setLoading(false);
    };

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('agriGuardUser', JSON.stringify(updatedUser));

        // Update in users database as well
        const users = JSON.parse(localStorage.getItem('agriGuardUsers') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('agriGuardUsers', JSON.stringify(users));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
