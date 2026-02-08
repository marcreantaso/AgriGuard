import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Calendar, Languages, ChevronRight, Settings } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    // Format date nicely
    const joinDate = user.joined ? new Date(user.joined).toLocaleDateString(language === 'en' ? 'en-US' : 'tl-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Unknown';

    const SettingItem = ({ icon: Icon, label, value, onClick, colorClass = "text-gray-500" }) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between py-4 group"
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${colorClass}`}>
                    <Icon size={20} />
                </div>
                <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    {value && <p className="text-xs text-gray-500">{value}</p>}
                </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-agri-green-500 transition-colors" />
        </button>
    );

    return (
        <div className="p-6 pb-24 pt-8 min-h-screen bg-gray-50/50">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('profile.title')}</h1>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-agri-green-100 rounded-full flex items-center justify-center text-agri-green-600 mb-4">
                    <User size={40} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">{t('common.farmer')}</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                <div className="bg-white rounded-3xl p-2 px-6 shadow-sm border border-gray-100">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">
                        {t('profile.account_details')}
                    </h3>
                    <div className="flex items-center gap-4 py-4 border-b border-gray-50">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                            <Calendar size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500">{t('profile.member_since')}</p>
                            <p className="text-sm font-medium text-gray-800">{joinDate}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-2 px-6 shadow-sm border border-gray-100">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">
                        {t('profile.settings')}
                    </h3>

                    <div className="flex items-center justify-between py-4 border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <Languages size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-gray-800">{t('profile.language')}</p>
                                <p className="text-xs text-gray-500">{language === 'en' ? 'English' : 'Tagalog'}</p>
                            </div>
                        </div>

                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === 'en' ? 'bg-white text-agri-green-600 shadow-sm' : 'text-gray-400'}`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage('tl')}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === 'tl' ? 'bg-white text-agri-green-600 shadow-sm' : 'text-gray-400'}`}
                            >
                                TL
                            </button>
                        </div>
                    </div>

                    <SettingItem
                        icon={Settings}
                        label="App Preferences"
                        colorClass="text-purple-500"
                    />
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="w-full mt-8 bg-white border border-red-100 text-red-500 font-bold py-4 rounded-2xl shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
                <LogOut size={20} />
                {t('common.logout')}
            </button>

            <p className="text-center text-gray-400 text-[10px] mt-8">
                AgriGuard App {t('common.version')}
            </p>
        </div>
    );
};

export default Profile;
