import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'sonner';

const Layout = () => {
    return (
        <div className="min-h-screen bg-agri-gray pb-24 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-agri-green-50 to-transparent pointer-events-none" />

            <main className="relative z-10 px-4 pt-6 max-w-lg mx-auto">
                <Outlet />
            </main>

            <Navbar />
            <Toaster position="top-center" />
        </div>
    );
};

export default Layout;
