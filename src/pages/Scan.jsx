import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, HelpCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Scan = () => {
    const webcamRef = useRef(null);
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [isFlashOn, setIsFlashOn] = useState(false);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            // In a real app, we'd upload this to an API
            // Storing in localStorage to pass large string
            localStorage.setItem('currentScan', imageSrc);
            navigate('/result');
        }
    }, [webcamRef, navigate]);

    const videoConstraints = {
        facingMode: "environment"
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col focus:outline-none">
            {/* Header controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
                <button onClick={() => navigate(-1)} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white active:scale-90 transition-transform">
                    <X size={24} />
                </button>
                <div className="text-white/80 font-medium text-sm bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
                    {t('scan.title')}
                </div>
                <button
                    onClick={() => setIsFlashOn(!isFlashOn)}
                    className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 ${isFlashOn ? 'bg-yellow-400/80 text-black' : 'bg-black/20 text-white'}`}
                >
                    <Zap size={24} fill={isFlashOn ? "currentColor" : "none"} />
                </button>
            </div>

            {/* Camera View */}
            <div className="relative flex-1 bg-gray-900 overflow-hidden">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay Guide */}
                <div className="absolute inset-0 flex items-center justify-center p-10 pointer-events-none">
                    <div className="w-full aspect-square max-w-xs border-2 border-white/50 rounded-3xl relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-agri-green-500 -mt-1 -ml-1 rounded-tl-xl shadow-[0_0_10px_rgba(76,175,80,0.5)]"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-agri-green-500 -mt-1 -mr-1 rounded-tr-xl shadow-[0_0_10px_rgba(76,175,80,0.5)]"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-agri-green-500 -mb-1 -ml-1 rounded-bl-xl shadow-[0_0_10px_rgba(76,175,80,0.5)]"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-agri-green-500 -mb-1 -mr-1 rounded-br-xl shadow-[0_0_10px_rgba(76,175,80,0.5)]"></div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white text-[12px] font-bold bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10 uppercase tracking-wider">
                                {t('scan.guide')}
                            </p>
                        </div>
                    </div>

                    {/* Scanning Animation Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-agri-green-400 shadow-[0_0_15px_rgba(76,175,80,0.8)] animate-scan opacity-70"></div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="bg-black/95 backdrop-blur-xl p-6 pb-12 rounded-t-[40px] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between max-w-xs mx-auto">
                    <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors">
                        <div className="p-4 rounded-full bg-white/10">
                            <ImageIcon size={24} />
                        </div>
                        <span className="text-[10px] font-medium">Gallery</span>
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
