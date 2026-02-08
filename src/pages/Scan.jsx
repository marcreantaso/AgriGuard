import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, HelpCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Scan = () => {
    const webcamRef = useRef(null);
    const navigate = useNavigate();
    const [isFlashOn, setIsFlashOn] = useState(false);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            // In a real app, we'd upload this to an API
            // For now, pass it to the result page via state or context
            // Using URL params for simplicity in this demo, but typically would use state
            // Storing in localStorage to pass large string
            localStorage.setItem('currentScan', imageSrc);
            navigate('/result');
        }
    }, [webcamRef, navigate]);

    const videoConstraints = {
        facingMode: "environment"
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
                <button onClick={() => navigate(-1)} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white">
                    <X size={24} />
                </button>
                <button
                    onClick={() => setIsFlashOn(!isFlashOn)}
                    className={`p-2 rounded-full backdrop-blur-md transition-colors ${isFlashOn ? 'bg-yellow-400/80 text-black' : 'bg-black/20 text-white'}`}
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
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-agri-green-500 -mt-1 -ml-1 rounded-tl-xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-agri-green-500 -mt-1 -mr-1 rounded-tr-xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-agri-green-500 -mb-1 -ml-1 rounded-bl-xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-agri-green-500 -mb-1 -mr-1 rounded-br-xl"></div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white/80 text-sm font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                                Position leaf within frame
                            </p>
                        </div>
                    </div>

                    {/* Scanning Animation Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-agri-green-400 shadow-[0_0_15px_rgba(76,175,80,0.8)] animate-scan opacity-70"></div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="bg-black/80 backdrop-blur-xl p-6 pb-10 rounded-t-3xl border-t border-white/10">
                <div className="flex items-center justify-between max-w-xs mx-auto">
                    <button className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                        <ImageIcon size={24} />
                    </button>

                    <button
                        onClick={capture}
                        className="w-20 h-20 rounded-full bg-white border-4 border-agri-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(76,175,80,0.4)] active:scale-95 transition-transform"
                    >
                        <div className="w-16 h-16 rounded-full bg-agri-green-500 border-2 border-white"></div>
                    </button>

                    <button className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                        <HelpCircle size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Scan;
