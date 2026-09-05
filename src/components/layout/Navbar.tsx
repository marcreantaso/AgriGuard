import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, MapPin, Scan, ShoppingCart, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Hide navbar on scan result pages, scan page, and marketplace detail
    if (['/scan', '/result'].includes(location.pathname) || location.pathname.startsWith('/marketplace/')) return null;

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/visits', icon: MapPin, label: 'Visits' },
        { path: '/marketplace', icon: ShoppingCart, label: 'Market' },
        { path: '/more', icon: MoreHorizontal, label: 'More' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none flex justify-center">
            <nav className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-xl rounded-full px-3 py-2 flex items-center justify-around pointer-events-auto max-w-sm w-full relative">
                {navItems.map((item, idx) => (
                    <React.Fragment key={item.path}>
                        {/* Insert scan button in the center (after index 1) */}
                        {idx === 2 && (
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => navigate('/scan')}
                                className="w-14 h-14 bg-gradient-to-br from-agri-green-500 to-agri-green-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-agri-green-200 -mt-6 border-4 border-white mx-1"
                            >
                                <Scan className="w-6 h-6" />
                            </motion.button>
                        )}
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `
                                relative p-2 rounded-full transition-colors duration-300
                                ${isActive ? 'text-agri-green-600 font-bold' : 'text-gray-400 hover:text-gray-600'}
                            `}
                        >
                            {({ isActive }) => (
                                <div className="flex flex-col items-center">
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className={`text-[9px] mt-0.5 font-bold ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute -bottom-0.5 w-1 h-1 bg-agri-green-600 rounded-full"
                                        />
                                    )}
                                </div>
                            )}
                        </NavLink>
                    </React.Fragment>
                ))}
            </nav>
        </div>
    );
};

export default Navbar;
