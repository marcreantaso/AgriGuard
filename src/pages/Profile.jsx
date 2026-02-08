import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Calendar } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    // Format date nicely
    const joinDate = user.joined ? new Date(user.joined).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Unknown';

    return (
        <div className="p-6 pb-24 pt-8 min-h-screen bg-gray-50/50">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-agri-green-100 rounded-full flex items-center justify-center text-agri-green-600 mb-4">
                    <User size={40} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">Smallholder Farmer</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Account Details</h3>

                <div className="flex items-center gap-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium text-gray-800">{joinDate}</p>
                    </div>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="w-full bg-white border-2 border-red-100 text-red-500 font-bold py-4 rounded-2xl shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
                <LogOut size={20} />
                Log Out
            </button>

            <p className="text-center text-gray-400 text-xs mt-8">
                AgriGuard App v0.1.0
            </p>
        </div>
    );
};

export default Profile;
