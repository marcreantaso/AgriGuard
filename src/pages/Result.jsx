import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Share2, Activity, Layers, ShieldCheck, ArrowLeft, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Result = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const queryParams = new URLSearchParams(location.search);
    const scanId = queryParams.get('id');

    // Mock result data based on ID or default
    const result = {
        disease: scanId === '2' ? 'Healthy' : (scanId === '101' ? 'Rice Blast' : (scanId === '103' ? 'Tomato Blight' : 'Rice Blast')),
        crop: (scanId === '103') ? 'Tomato' : (scanId === '2' || scanId === '102' ? 'Corn' : 'Rice'),
        confidence: 98.4,
        status: (scanId === '102' || scanId === '2') ? 'healthy' : 'critical',
        date: 'Feb 8, 2026',
        description: "A major disease that can cause significant yield loss. Our CNN model identifies patterns in the leaf structure to determine health status.",
        recommendations: [
            "Monitor plant health daily.",
            "Remove any infected debris immediately.",
            "Consult with local agricultural experts."
        ],
        cnn_details: {
            layers: 16,
            architecture: "ResNet-50 Optimized",
            data_points: "450k+ samples",
            parameters: "23.5M"
        }
    };

    return (
        <div className="p-6 pb-24 pt-8 bg-gray-50/50 min-h-screen font-inter">
            <header className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-90 transition-all font-bold text-gray-600 flex items-center gap-2"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase">{t('result.title')}</h1>
                <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-90 transition-all">
                    <Share2 size={20} className="text-gray-600" />
                </button>
            </header>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
            >
                {/* Visual Report Card */}
                <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-agri-green-900/5 border border-white">
                    <div className="h-56 w-full relative">
                        <img
                            src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80"
                            className="w-full h-full object-cover"
                            alt="Scanned specimen"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            <div className="flex items-center gap-3">
                                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${result.status === 'healthy' ? 'bg-green-500/80 text-white border-green-400' : 'bg-red-500/80 text-white border-red-400'
                                    }`}>
                                    {result.status}
                                </div>
                                <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{t('result.detected_on')} {result.date}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[10px] font-black text-agri-green-600 uppercase tracking-[0.2em] mb-1">{result.crop}</p>
                                <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tighter">{result.disease}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('result.confidence')}</p>
                                <div className="text-2xl font-black text-agri-green-600 tracking-tighter">{result.confidence}%</div>
                            </div>
                        </div>

                        {/* CNN Engine Diagnostics */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <div className="flex items-center gap-2 mb-2 text-agri-green-600">
                                    <Activity size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Algorithm</span>
                                </div>
                                <p className="text-xs font-bold text-gray-800">{result.cnn_details.architecture}</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <div className="flex items-center gap-2 mb-2 text-blue-500">
                                    <Layers size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Networks</span>
                                </div>
                                <p className="text-xs font-bold text-gray-800">{result.cnn_details.layers} Detection Layers</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Info size={18} className="text-agri-green-600" />
                                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs uppercase">{t('result.description_label')}</h3>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">{result.description}</p>
                            </div>

                            <div className="p-6 bg-agri-green-50 rounded-3xl border border-agri-green-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <ShieldCheck size={18} className="text-agri-green-600" />
                                    <h3 className="font-black text-agri-green-700 uppercase tracking-widest text-xs">{t('result.treatment_label')}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {result.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-5 h-5 bg-white rounded-lg flex items-center justify-center text-agri-green-600 text-[10px] font-black flex-shrink-0 border border-agri-green-100 shadow-sm">{i + 1}</div>
                                            <p className="text-xs text-agri-green-800 font-bold leading-relaxed">{rec}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/scan')}
                        className="flex-1 bg-white border-2 border-agri-green-500 text-agri-green-600 font-black py-4 rounded-2xl active:scale-95 transition-all shadow-lg shadow-agri-green-900/5 hover:bg-agri-green-50"
                    >
                        {t('common.scan_again')}
                    </button>
                    <button className="flex-1 bg-agri-green-500 text-white font-black py-4 rounded-2xl active:scale-95 transition-all shadow-lg shadow-agri-green-200 hover:bg-agri-green-600">
                        {t('common.view_shop')}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Result;
