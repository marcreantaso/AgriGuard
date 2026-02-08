import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronRight, FileSearch } from 'lucide-react';
import Card from '../components/common/Card';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    // Mock progressive scan history data
    const historyData = [
        {
            date: t('history.today'),
            items: [
                { id: 101, crop: 'Rice', disease: 'Rice Blast', status: 'critical', time: '10:30 AM', img: 'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&q=80&w=200&h=200' }
            ]
        },
        {
            date: t('history.yesterday'),
            items: [
                { id: 102, crop: 'Palay', disease: 'Healthy', status: 'healthy', time: '02:15 PM', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200&h=200' },
                { id: 103, crop: 'Rice', disease: 'Leaf Blight', status: 'mild', time: '09:45 AM', img: 'https://images.unsplash.com/photo-1628155530391-f92591609121?auto=format&fit=crop&q=80&w=200&h=200' }
            ]
        },
        {
            date: t('history.earlier'),
            items: [
                { id: 104, crop: 'Rice', disease: 'Tungro Virus', status: 'critical', time: 'Feb 5, 2026', img: 'https://images.unsplash.com/photo-1563200155-22d768133527?auto=format&fit=crop&q=80&w=200&h=200' },
                { id: 105, crop: 'Palay', disease: 'Stem Borer', status: 'mild', time: 'Feb 4, 2026', img: 'https://images.unsplash.com/photo-1615814702165-44243851532f?auto=format&fit=crop&q=80&w=200&h=200' }
            ]
        }
    ];

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
                                        onClick={() => navigate(`/result?id=${scan.id}`)}
                                        className="w-full bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
                                    >
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
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
