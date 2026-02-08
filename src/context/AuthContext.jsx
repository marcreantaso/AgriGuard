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
                // Simulate a small delay for verification
                await new Promise(resolve => setTimeout(resolve, 500));
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (name) => {
        setLoading(true);
        // Simulate real-time authentication delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        const newUser = {
            name,
            joined: new Date().toISOString(),
            id: 'farmer_' + Math.floor(Math.random() * 10000)
        };

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
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
