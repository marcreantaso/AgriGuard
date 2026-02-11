import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Shield, BarChart3, MapPin, User, Store, ChevronRight, LogOut, Settings, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const menuItems = [
    { label: 'Digital Wallet', desc: 'Earnings & payouts', icon: Wallet, path: '/wallet', color: 'bg-agri-purple-500', iconColor: 'text-white' },
    { label: 'Safety Logs', desc: 'Health & incident reports', icon: Shield, path: '/safety', color: 'bg-agri-red-500', iconColor: 'text-white' },
    { label: 'Analytics', desc: 'Performance dashboard', icon: BarChart3, path: '/analytics', color: 'bg-agri-amber-500', iconColor: 'text-white' },
    { label: 'Shop Locator', desc: 'Find agri-stores nearby', icon: Store, path: '/shops', color: 'bg-agri-blue-500', iconColor: 'text-white' },
    { label: 'Profile', desc: 'Account settings', icon: User, path: '/profile', color: 'bg-gray-500', iconColor: 'text-white' },
];

const More = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="pb-28 px-1 pt-2">
            {/* User Header */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-agri-green-100 rounded-2xl flex items-center justify-center text-agri-green-600 font-bold text-xl overflow-hidden">
                        {user?.photoUrl ? (
                            <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.[0] || 'F'
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="font-black text-gray-900 text-lg">{user?.name || 'Farmer'}</h2>
                        <p className="text-xs text-gray-400">{user?.email || 'farmer@agriguard.app'}</p>
                    </div>
                    <div className="w-10 h-10 bg-agri-green-50 rounded-xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-agri-green-500" />
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-2 mb-6">
                {menuItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <motion.button
                            key={item.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            onClick={() => navigate(item.path)}
                            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-4 active:scale-[0.98] transition-transform"
                        >
                            <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center shadow-sm`}>
                                <Icon className={`w-5 h-5 ${item.iconColor}`} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                                <p className="text-[10px] text-gray-400">{item.desc}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </motion.button>
                    );
                })}
            </div>

            {/* Help & Logout */}
            <div className="space-y-2">
                <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-4">
                    <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-bold text-gray-900 text-sm">Help & Support</p>
                        <p className="text-[10px] text-gray-400">FAQs, contact us</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    className="w-full bg-red-50 rounded-2xl p-4 border border-red-100 flex items-center gap-4"
                >
                    <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-bold text-red-600 text-sm">Logout</p>
                        <p className="text-[10px] text-red-400">Sign out of AgriGuard</p>
                    </div>
                </motion.button>
            </div>

            {/* Version */}
            <p className="text-center text-[10px] text-gray-300 mt-8 font-medium">AgriGuard Mobile v1.0.0</p>
        </div>
    );
};

export default More;
