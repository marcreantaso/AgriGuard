import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate a small delay for better UX
        setTimeout(() => {
            login('Juan dela Cruz');
            navigate('/');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-agri-green-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-60"></div>

            <div className="w-24 h-24 bg-agri-green-100 rounded-3xl flex items-center justify-center mb-6 text-4xl shadow-sm z-10">🌱</div>
            <h1 className="text-3xl font-bold text-agri-green-700 mb-2 z-10">AgriGuard</h1>
            <p className="text-gray-500 mb-10 text-center z-10">Protecting your crops with AI</p>

            <button
                onClick={handleLogin}
                disabled={loading}
                className="z-10 w-full max-w-xs bg-agri-green-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-agri-green-600 active:scale-95 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                    </span>
                ) : (
                    "Login as Farmer"
                )}
            </button>
            <p className="mt-6 text-sm text-gray-400 z-10">Version 1.0.0</p>
        </div>
    );
};

export default Login;
