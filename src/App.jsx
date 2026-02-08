import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Result from './pages/Result';
import Login from './pages/Login';
import Profile from './pages/Profile';

import History from './pages/History';
import ErrorBoundary from './components/common/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
                <div className="w-16 h-16 border-4 border-agri-green-100 border-t-agri-green-500 rounded-full animate-spin mb-4"></div>
                <p className="text-agri-green-600 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">AgriGuard</p>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const App = () => {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <LanguageProvider>
                        <LocationProvider>
                            <Routes>
                                <Route path="/login" element={<Login />} />

                                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                                    <Route index element={<Home />} />
                                    <Route path="scan" element={<Scan />} />
                                    <Route path="result" element={<Result />} />
                                    <Route path="profile" element={<Profile />} />
                                    <Route path="history" element={<History />} />
                                </Route>

                                {/* Redirect any unknown routes to home */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </LocationProvider>
                    </LanguageProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
};

export default App;
