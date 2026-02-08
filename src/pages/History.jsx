import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronRight, FileSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        // Load persistent scans from "database"
        const savedScans = JSON.parse(localStorage.getItem('agriGuardScans') || '[]');

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = (dateStr) => {
            const d = new Date(dateStr);
            return d.getDate() === today.getDate() &&
                d.getMonth() === today.getMonth() &&
                d.getFullYear() === today.getFullYear();
        };

        const isYesterday = (dateStr) => {
            const d = new Date(dateStr);
            return d.getDate() === yesterday.getDate() &&
                d.getMonth() === yesterday.getMonth() &&
                d.getFullYear() === yesterday.getFullYear();
        };

        const todayScans = savedScans.filter(s => isToday(s.fullDate));
        const yesterdayScans = savedScans.filter(s => isYesterday(s.fullDate));
        const earlierScans = savedScans.filter(s => !isToday(s.fullDate) && !isYesterday(s.fullDate));

        // Fallback mock data for demo purposes - ordered as: Stem Borer, Tungro, Healthy, Rice Blast
        const mockEarlier = [
            { id: 101, crop: 'Rice', disease: 'Stem Borer Damage', status: 'critical', time: '10:30 AM', img: 'https://www.irri.org/sites/default/files/inline-images/stem-borer-damage.jpg' },
            { id: 102, crop: 'Rice', disease: 'Tungro Virus', status: 'critical', time: '02:15 PM', img: 'https://www.irri.org/sites/default/files/inline-images/tungro-symptoms.jpg' },
            { id: 103, crop: 'Rice', disease: 'Healthy', status: 'healthy', time: '09:45 AM', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=200&h=200' },
            { id: 104, crop: 'Rice', disease: 'Rice Blast', status: 'critical', time: 'Feb 5, 2026', img: 'https://www.irri.org/sites/default/files/inline-images/blast-lesions.jpg' }
        ];

        setHistoryData([
            { date: t('history.today'), items: todayScans.length > 0 ? todayScans : mockEarlier.slice(0, 2) },
            { date: t('history.yesterday'), items: yesterdayScans.length > 0 ? yesterdayScans : [mockEarlier[2]] },
            { date: t('history.earlier'), items: earlierScans.length > 0 ? earlierScans : [mockEarlier[3]] }
        ]);
    }, [t]);

    return (
        <div className="p-6 pb-24 pt-8 min-h-screen bg-gray-50/50">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-black text-gray-800">{t('history.title')}</h1>
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-agri-green-500 shadow-sm border border-gray-100">
                    <Clock size={20} />
                </div>
            </header>

            <div className="space-y-8">
                {historyData.map((group, sectionIndex) => (
                    <div key={sectionIndex} className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px flex-1 bg-gray-200"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50 px-2">
                                {group.date}
                            </span>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>

                        <div className="space-y-4">
                            {group.items.map((scan, index) => (
                                <motion.div
                                    key={scan.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <button
                                        onClick={() => navigate('/result', { state: { scanResult: scan } })}
                                        className="w-full bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
                                    >
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                                            <img src={scan.img} alt={scan.crop} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-gray-900">{scan.disease}</h4>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${scan.status === 'healthy' ? 'bg-green-100 text-green-600' :
                                                    scan.status === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                                    }`}>
                                                    {scan.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-gray-500 font-medium">{scan.crop}</p>
                                                <p className="text-[10px] text-gray-300 font-bold">{scan.time}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-200" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {historyData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                    <FileSearch size={64} className="mb-4" />
                    <p className="font-bold">{t('history.empty')}</p>
                </div>
            )}
        </div>
    );
};

export default History;
