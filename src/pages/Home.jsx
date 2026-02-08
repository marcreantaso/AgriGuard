import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Sun, Cloud, CloudRain, MapPin, ChevronRight, Droplets, Wind } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { motion } from 'framer-motion';

const Home = () => {
    const { user } = useAuth();
    const { weather, location, loading: locationLoading } = useLocation();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const getWeatherIcon = (condition) => {
        switch (condition?.toLowerCase()) {
            case 'rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
            case 'cloudy': return <Cloud className="w-8 h-8 text-gray-400" />;
            default: return <Sun className="w-8 h-8 text-yellow-400" />;
        }
    };

    // Mock recent scans
    const recentScans = [
        { id: 1, crop: 'Rice', disease: 'Blast', status: 'critical', date: 'Today', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=150&h=150' },
        { id: 2, crop: 'Corn', disease: 'Healthy', status: 'healthy', date: 'Yesterday', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=150&h=150' },
        { id: 3, crop: 'Tomato', disease: 'Blight', status: 'mild', date: 'Mon', img: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=150&h=150' },
    ];

    return (
        <div className="space-y-6 pb-20">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-start"
            >
                <div>
                    <h2 className="text-agri-green-700 font-medium">{t('home.greeting')}</h2>
                    <h1 className="text-3xl font-bold text-gray-900">{user?.name || t('common.farmer')}!</h1>
                </div>
                <div className="w-10 h-10 bg-agri-green-100 rounded-full flex items-center justify-center text-agri-green-600 font-bold">
                    {user?.name?.[0] || 'F'}
                </div>
            </motion.div>

            {/* Weather Widget */}
            <Card className="bg-gradient-to-br from-agri-green-500 to-agri-green-600 text-white border-none">
                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center text-agri-green-100 text-sm mb-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                {locationLoading ? t('home.locating') : (weather?.locationName || 'San Jose, Nueva Ecija')}
                            </div>
                            <div className="text-4xl font-bold flex items-center">
                                {weather?.temp || 28}°
                                <span className="text-lg font-normal ml-1 text-agri-green-100">C</span>
                            </div>
                            <p className="text-agri-green-50">{weather?.condition || 'Partly Cloudy'}</p>
                        </div>
                        {getWeatherIcon(weather?.condition)}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/20">
                        <div className="flex items-center text-sm text-agri-green-50">
                            <Droplets className="w-4 h-4 mr-2" />
                            {weather?.humidity || 65}% {t('home.humidity')}
                        </div>
                        <div className="flex items-center text-sm text-agri-green-50">
                            <Wind className="w-4 h-4 mr-2" />
                            {weather?.windSpeed || 12} km/h {t('home.wind')}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Action - Scan */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <button
                    onClick={() => navigate('/scan')}
                    className="w-full bg-white rounded-3xl p-6 shadow-lg border border-agri-green-100 flex items-center justify-between group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-agri-orange-100 rounded-2xl flex items-center justify-center text-agri-orange-500 group-hover:bg-agri-orange-500 group-hover:text-white transition-colors duration-300">
                            <Camera className="w-8 h-8" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-gray-900">{t('home.scan_crop')}</h3>
                            <p className="text-gray-500 text-sm">{t('home.scan_desc')}</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-agri-green-50 group-hover:text-agri-green-600 transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </div>
                </button>
            </motion.div>

            {/* Recent Scans */}
            <div>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-bold text-gray-900">{t('home.recent_scans')}</h3>
                    <button className="text-agri-green-600 text-sm font-medium hover:underline">{t('home.view_all')}</button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {recentScans.map((scan) => (
                        <Card key={scan.id} className="min-w-[140px] flex-shrink-0" onClick={() => navigate(`/result?id=${scan.id}`)}>
                            <div className="h-28 w-full bg-gray-200 relative">
                                <img src={scan.img} alt={scan.crop} className="w-full h-full object-cover" />
                                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${scan.status === 'healthy' ? 'bg-green-500 text-white' :
                                    scan.status === 'critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                                    }`}>
                                    {scan.status}
                                </div>
                            </div>
                            <div className="p-3">
                                <h4 className="font-bold text-gray-900">{scan.disease}</h4>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">{scan.crop}</span>
                                    <span className="text-[10px] text-gray-400">{scan.date}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
