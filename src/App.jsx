import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Result from './pages/Result';
import Login from './pages/Login';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // Or a loading spinner
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
                            <Route path="profile" element={<Profile />} />
                            {/* Placeholders for other nav items */}
                            <Route path="history" element={<div className="p-4 text-center text-gray-500 mt-10">Scan History Coming Soon</div>} />
                        </Route>

                        {/* Redirect any unknown routes to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </LocationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
