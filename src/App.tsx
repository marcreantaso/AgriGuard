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
import ShopLocator from './pages/ShopLocator';
import History from './pages/History';
import FieldVisits from './pages/FieldVisits';
import Marketplace from './pages/Marketplace';
import MarketplaceDetail from './pages/MarketplaceDetail';
import Wallet from './pages/Wallet';
import SafetyLogs from './pages/SafetyLogs';
import Analytics from './pages/Analytics';
import More from './pages/More';
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
                                    <Route path="shops" element={<ShopLocator />} />
                                    <Route path="profile" element={<Profile />} />
                                    <Route path="history" element={<History />} />
                                    <Route path="visits" element={<FieldVisits />} />
                                    <Route path="marketplace" element={<Marketplace />} />
                                    <Route path="marketplace/:id" element={<MarketplaceDetail />} />
                                    <Route path="wallet" element={<Wallet />} />
                                    <Route path="safety" element={<SafetyLogs />} />
                                    <Route path="analytics" element={<Analytics />} />
                                    <Route path="more" element={<More />} />
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
