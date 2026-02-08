import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Result from './pages/Result';

// Simple Login Page for demo purposes
const Login = () => {
    const { login } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        login('Juan dela Cruz');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <div className="w-24 h-24 bg-agri-green-100 rounded-3xl flex items-center justify-center mb-6 text-4xl">🌱</div>
            <h1 className="text-3xl font-bold text-agri-green-700 mb-2">AgriGuard</h1>
            <p className="text-gray-500 mb-10 text-center">Protecting your crops with AI</p>

            <button
                onClick={handleLogin}
                className="w-full max-w-xs bg-agri-green-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-agri-green-600 transition-colors"
            >
                Login as Farmer
            </button>
            <p className="mt-6 text-sm text-gray-400">Version 1.0.0</p>
        </div>
    );
};

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <LocationProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                            <Route index element={<Home />} />
                            <Route path="scan" element={<Scan />} />
                            <Route path="result" element={<Result />} />
                            {/* Placeholders for other nav items */}
                            <Route path="history" element={<div className="p-4 text-center text-gray-500 mt-10">Scan History Coming Soon</div>} />
                            <Route path="profile" element={<div className="p-4 text-center text-gray-500 mt-10">Profile Settings Coming Soon</div>} />
                        </Route>

                    </Routes>
                </LocationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
