import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Sun, Cloud, CloudRain, MapPin, ChevronRight, Droplets, Wind, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/common/Card';
import { motion } from 'framer-motion';

const Home = () => {
    const { user } = useAuth();
    const { weather, loading: locationLoading, refresh } = useLocation();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const getWeatherIcon = (condition) => {
        const cond = condition?.toLowerCase() || '';
        if (cond.includes('rain')) return <CloudRain className="w-10 h-10 text-white/90" />;
        if (cond.includes('cloud')) return <Cloud className="w-10 h-10 text-white/90" />;
        return <Sun className="w-10 h-10 text-yellow-300" />;
    };

    // Mock recent scans
    const recentScans = [
        { id: 1, crop: 'Rice', disease: 'Blast', status: 'critical', date: 'Today', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=150&h=150' },
        { id: 2, crop: 'Corn', disease: 'Healthy', status: 'healthy', date: 'Yesterday', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=150&h=150' },
        { id: 3, crop: 'Tomato', disease: 'Blight', status: 'mild', date: 'Mon', img: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=150&h=150' },
    ];

    return (
        <div className="space-y-6 pb-24 px-4 pt-4">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <p className="text-agri-green-600 font-semibold text-sm uppercase tracking-wider">{t('home.greeting')}</p>
                    <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                        {user?.name?.split(' ')[0] || t('common.farmer')}!
                    </h1>
                </div>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 bg-agri-green-100 rounded-2xl flex items-center justify-center text-agri-green-600 font-bold shadow-sm border border-agri-green-200"
                >
                    {user?.name?.[0] || 'F'}
                </motion.div>
            </motion.div>

            {/* Weather Widget */}
            <Card className="bg-gradient-to-br from-agri-green-500 via-agri-green-600 to-agri-green-700 text-white border-none shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <button
                                onClick={refresh}
                                disabled={locationLoading}
                                className="flex items-center text-agri-green-50 text-xs font-semibold uppercase tracking-widest bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md active:scale-95 transition-all disabled:opacity-50"
                            >
                                <MapPin className="w-3.5 h-3.5 mr-1.5 text-agri-green-300" />
                                {locationLoading ? t('home.locating') : (weather?.locationName || 'Detecting...')}
                                <RefreshCw className={`ml-2 w-3 h-3 ${locationLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-5xl font-black">{weather?.temp || '--'}</span>
                                <span className="text-2xl font-bold ml-1 text-agri-green-200">°C</span>
                            </div>
                            <p className="text-agri-green-100 font-medium mt-1">{weather?.condition || 'Updating...'}</p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 shadow-inner">
                            {getWeatherIcon(weather?.condition)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Droplets className="w-5 h-5 text-agri-green-200" />
                            </div>
                            <div>
                                <p className="text-[10px] text-agri-green-200 font-bold uppercase tracking-tighter">{t('home.humidity')}</p>
                                <p className="font-bold text-sm tracking-tight">{weather?.humidity || '--'} %</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Wind className="w-5 h-5 text-agri-green-200" />
                            </div>
                            <div>
                                <p className="text-[10px] text-agri-green-200 font-bold uppercase tracking-tighter">{t('home.wind')}</p>
                                <p className="font-bold text-sm tracking-tight">{weather?.windSpeed || '--'} km/h</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Action - Scan */}
            <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
            >
                <button
                    onClick={() => navigate('/scan')}
                    className="w-full bg-white rounded-[32px] p-6 shadow-xl shadow-agri-green-900/5 border border-gray-100 flex items-center justify-between group transition-all"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-agri-orange-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-agri-orange-200 group-hover:rotate-12 transition-transform duration-300">
                            <Camera className="w-8 h-8" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">{t('home.scan_crop')}</h3>
                            <p className="text-gray-500 text-sm font-medium">{t('home.scan_desc')}</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-agri-green-500 group-hover:text-white transition-all shadow-inner">
                        <ChevronRight className="w-6 h-6" />
                    </div>
                </button>
            </motion.div>

            {/* Recent Scans */}
            <div>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-black text-gray-900 text-lg tracking-tight">{t('home.recent_scans')}</h3>
                    <button className="text-agri-green-600 text-xs font-bold uppercase tracking-widest hover:text-agri-green-700">{t('home.view_all')}</button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x">
                    {recentScans.map((scan) => (
                        <Card key={scan.id} className="min-w-[160px] flex-shrink-0 snap-center border-none shadow-lg shadow-gray-200" onClick={() => navigate(`/result?id=${scan.id}`)}>
                            <div className="h-32 w-full relative overflow-hidden">
                                <img src={scan.img} alt={scan.crop} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md ${scan.status === 'healthy' ? 'bg-green-500 text-white' :
                                    scan.status === 'critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                                    }`}>
                                    {scan.status}
                                </div>
                            </div>
                            <div className="p-4 bg-white">
                                <h4 className="font-bold text-gray-900 tracking-tight">{scan.disease}</h4>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{scan.crop}</span>
                                    <span className="text-[10px] font-bold text-gray-300">{scan.date}</span>
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
