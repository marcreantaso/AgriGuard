import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';
import { tokenStorage } from '../utils/tokenStorage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from stored token
    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            setError(null);

            try {
                const storedUser = tokenStorage.getUser();
                const token = tokenStorage.getToken();

                if (token && storedUser) {
                    // Verify token is still valid
                    try {
                        const response = await authApi.verify();
                        setUser(response.user);
                    } catch (verifyError) {
                        // Token is invalid, clear storage
                        tokenStorage.clear();
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                setError(err.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.login(email, password);
            setUser(response.user);
            return response;
        } catch (err) {
            setError(err.message || 'Login failed');
            setUser(null);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.signup(userData);
            setUser(response.user);
            return response;
        } catch (err) {
            setError(err.message || 'Signup failed');
            setUser(null);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            await authApi.logout();
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
            // Still clear user even if logout fails
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (updates) => {
        try {
            const response = await authApi.updateProfile(updates);
            setUser(response.user);
            return response.user;
        } catch (err) {
            setError(err.message || 'Update failed');
            throw err;
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            return await authApi.changePassword(currentPassword, newPassword);
        } catch (err) {
            setError(err.message || 'Password change failed');
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        signup,
        logout,
        updateUser,
        changePassword,
        isAuthenticated: !!user && tokenStorage.hasToken()
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
