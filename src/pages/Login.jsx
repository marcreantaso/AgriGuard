import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name && isSignUp) return;

        setLoading(true);
        try {
            // In a real app, we'd pass credentials. For now, we pass the name entered.
            const displayName = name || 'Farmer';
            await login(displayName);
            navigate('/');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-inter">
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-agri-green-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-60"></div>

            <div className="w-20 h-20 bg-agri-green-100 rounded-3xl flex items-center justify-center mb-6 text-3xl shadow-sm z-10 border border-agri-green-200">🌱</div>
            <h1 className="text-3xl font-black text-agri-green-700 mb-2 z-10">{t('common.app_name')}</h1>
            <p className="text-gray-500 mb-8 text-center z-10 font-medium">{t('login.protect_crops')}</p>

            <form onSubmit={handleSubmit} className="w-full max-w-xs z-10 space-y-4">
                {isSignUp && (
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t('login.full_name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-agri-green-500 focus:bg-white transition-all font-medium text-gray-700"
                        />
                    </div>
                )}

                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-agri-green-500 focus:bg-white transition-all font-medium text-gray-700"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-agri-green-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-agri-green-200 hover:bg-agri-green-600 active:scale-95 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isSignUp ? t('login.signing_up') : t('login.logging_in')}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            {isSignUp ? t('login.signup_btn') : t('login.login_btn')}
                            <ArrowRight className="w-5 h-5" />
                        </span>
                    )}
                </button>
            </form>

            <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-6 text-sm font-bold text-agri-green-600 hover:text-agri-green-700 active:scale-95 transition-all z-10"
            >
                {isSignUp ? t('login.have_account') : t('login.no_account')}
            </button>

            <p className="mt-10 text-[10px] font-bold text-gray-300 z-10 uppercase tracking-widest">{t('common.version')}</p>
        </div>
    );
};

export default Login;
