import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { Camera, RefreshCcw, HelpCircle, X, ChevronLeft, Cpu, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

const Scan = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [cnnStep, setCnnStep] = useState(0);
    const webcamRef = useRef(null);
    const navigate = useNavigate();
    const { t } = useLanguage();

    const cnnSteps = [
        t('scan.cnn_steps.extracting'),
        t('scan.cnn_steps.matching'),
        t('scan.cnn_steps.classifying')
    ];

    const capture = () => {
        setIsScanning(true);
        setCnnStep(0);
    };

    useEffect(() => {
        if (isScanning) {
            const timer = setInterval(() => {
                setCnnStep(prev => {
                    if (prev >= cnnSteps.length - 1) {
                        clearInterval(timer);
                        setTimeout(() => navigate('/result'), 500);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isScanning]);

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col font-inter">
            {/* Header */}
            <div className="relative z-10 p-6 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
                <button onClick={() => navigate(-1)} className="text-white bg-white/10 p-3 rounded-2xl backdrop-blur-md active:scale-90 transition-all">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-white font-black uppercase tracking-widest text-sm">{t('scan.title')}</h2>
                <button className="text-white bg-white/10 p-3 rounded-2xl backdrop-blur-md active:scale-90 transition-all">
                    <HelpCircle size={24} />
                </button>
            </div>

            {/* Camera Preview */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: 'environment' }}
                    className="h-full w-full object-cover"
                />

                {/* CNN Scan Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-72 h-72 border-2 border-white/30 rounded-[40px] relative overflow-hidden">
                        <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-agri-green-400 to-transparent shadow-[0_0_15px_rgba(74,222,128,0.8)] z-10"
                        />
                        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
                    </div>
                </div>

                {/* CNN Processing Modal */}
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-10"
                        >
                            <div className="relative mb-8">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="w-32 h-32 border-2 border-dashed border-agri-green-500/30 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-agri-green-500 rounded-3xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(74,222,128,0.4)]">
                                        <Cpu size={32} className="animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center w-full max-w-xs">
                                <h3 className="text-white font-black text-xl mb-2 tracking-tight">{t('scan.scanning')}</h3>
                                <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
                                    <motion.div
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${((cnnStep + 1) / cnnSteps.length) * 100}%` }}
                                        className="h-full bg-agri-green-500"
                                    />
                                </div>

                                <div className="space-y-3">
                                    {cnnSteps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= cnnStep ? 'bg-agri-green-500 scale-125' : 'bg-white/10'}`} />
                                            <p className={`text-sm font-bold transition-all duration-300 ${i <= cnnStep ? 'text-white' : 'text-white/20'}`}>
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="p-8 bg-gradient-to-t from-black to-transparent flex flex-col items-center">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-8">{t('scan.guide')}</p>
                <div className="flex items-center gap-12">
                    <button className="text-white/40 active:scale-90 transition-all">
                        <Zap size={24} />
                    </button>
                    <button
                        onClick={capture}
                        className="w-20 h-20 rounded-full bg-white border-[6px] border-agri-green-500 flex items-center justify-center shadow-[0_0_40px_rgba(76,175,80,0.6)] active:scale-90 transition-all"
                    >
                        <div className="w-14 h-14 rounded-full bg-agri-green-500 border-2 border-white shadow-inner"></div>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors">
                        <div className="p-4 rounded-full bg-white/10">
                            <HelpCircle size={24} />
                        </div>
                        <span className="text-[10px] font-medium">{t('scan.help')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Scan;
