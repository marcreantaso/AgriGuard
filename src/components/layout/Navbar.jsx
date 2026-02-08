import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Scan, User, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = () => {
    const location = useLocation();
    const { t } = useLanguage();

    // Hide navbar on scan result pages or scan page if needed
    if (location.pathname === '/scan' || location.pathname === '/result') return null;

    const navItems = [
        { path: '/', icon: Home, label: t('common.home') },
        { path: '/history', icon: History, label: t('home.recent_scans') },
        { path: '/profile', icon: User, label: t('profile.title') },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none flex justify-center">
            <nav className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-xl rounded-full px-6 py-3 flex items-center justify-around pointer-events-auto max-w-sm w-full">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            relative p-2 rounded-full transition-colors duration-300
                            ${isActive ? 'text-agri-green-600 font-bold' : 'text-gray-400 hover:text-gray-600'}
                        `}
                    >
                        {({ isActive }) => (
                            <div className="flex flex-col items-center">
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[10px] mt-0.5 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute -bottom-1 w-1 h-1 bg-agri-green-600 rounded-full"
                                    />
                                )}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Navbar;
