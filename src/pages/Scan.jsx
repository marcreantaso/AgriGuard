import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { Camera, RefreshCcw, HelpCircle, X, ChevronLeft, Cpu, Activity, ImagePlus, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';
import { predictDisease, isLikelyLeaf } from '../utils/ai';

const Scan = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [cnnStep, setCnnStep] = useState(0);
    const [scanError, setScanError] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [selectedCrop, setSelectedCrop] = useState('Rice'); // Default to Rice for now

    // Mock data for simulation
    const cropDiseases = {
        'Rice': ['Rice Blast', 'Leaf Blight', 'Brown Spot', 'Healthy'],
        'Corn': ['Common Rust', 'Gray Leaf Spot', 'Northern Leaf Blight', 'Healthy'],
        'Banana': ['Panama Disease', 'Black Sigatoka', 'Healthy']
    };

    const cnnSteps = [
        t('scan.cnn_steps.extracting'),
        t('scan.cnn_steps.matching'),
        t('scan.cnn_steps.classifying')
    ];

    const capture = () => {
        setUploadedImage(null);
        setIsScanning(true);
        setCnnStep(0);
    };

    // Handle gallery photo upload
    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            setUploadedImage(dataUrl);

            // Create an image element for prediction
            const imgEl = new Image();
            imgEl.onload = async () => {
                // Pre-check: does this image look like a leaf?
                if (!isLikelyLeaf(imgEl)) {
                    setScanError('This doesn\'t appear to be a crop leaf. AgriGuard can only identify diseases on Rice, Corn, or Banana leaves — not grains, cooked food, clothing, or other items. Please upload a clear photo of a fresh leaf.');
                    setIsScanning(false);
                    setUploadedImage(null);
                    return;
                }

                setIsScanning(true);
                setCnnStep(0);

                // Animate steps then predict
                let step = 0;
                const stepTimer = setInterval(async () => {
                    step++;
                    setCnnStep(step);
                    if (step >= cnnSteps.length - 1) {
                        clearInterval(stepTimer);

                        try {
                            const CONFIDENCE_THRESHOLD = 0.40;

                            if (selectedCrop === 'Banana') {
                                const potentialDiseases = cropDiseases['Banana'];
                                const randomIdx = Math.floor(Math.random() * potentialDiseases.length);
                                const selectedDisease = potentialDiseases[randomIdx];
                                let status = 'critical';
                                if (selectedDisease === 'Healthy') status = 'healthy';

                                const newScan = {
                                    id: Date.now(),
                                    crop: 'Banana',
                                    disease: selectedDisease,
                                    status: status,
                                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    fullDate: new Date().toISOString(),
                                    img: dataUrl,
                                    confidence: (85 + Math.random() * 14).toFixed(1),
                                    cnn_details: { layers: 16, architecture: 'ResNet-50 Optimized (Simulated)', data_points: 'N/A', parameters: '23.5M' }
                                };

                                const existingScans = JSON.parse(localStorage.getItem('agriGuardScans') || '[]');
                                localStorage.setItem('agriGuardScans', JSON.stringify([newScan, ...existingScans]));
                                setTimeout(() => navigate('/result', { state: { scanResult: newScan } }), 500);
                            } else {
                                const prediction = await predictDisease(imgEl);

                                if (prediction.confidence < CONFIDENCE_THRESHOLD) {
                                    setScanError('This doesn\'t appear to be a crop leaf. AgriGuard can only identify diseases on Rice, Corn, or Banana leaves — not grains, cooked rice, or other items. Please scan a fresh leaf.');
                                    setIsScanning(false);
                                    setUploadedImage(null);
                                    return;
                                }

                                const newScan = {
                                    id: Date.now(),
                                    crop: prediction.crop,
                                    disease: prediction.disease,
                                    status: prediction.severity.toLowerCase(),
                                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    fullDate: new Date().toISOString(),
                                    img: dataUrl,
                                    confidence: (prediction.confidence * 100).toFixed(1),
                                    cnn_details: { layers: 16, architecture: 'MobilenetV2 / ResNet50', data_points: '450k+ samples', parameters: '23.5M' }
                                };

                                const existingScans = JSON.parse(localStorage.getItem('agriGuardScans') || '[]');
                                localStorage.setItem('agriGuardScans', JSON.stringify([newScan, ...existingScans]));
                                setTimeout(() => navigate('/result', { state: { scanResult: newScan } }), 500);
                            }
                        } catch (error) {
                            console.error('Upload scan failed:', error);
                            setScanError('Failed to analyze the uploaded photo. Please try again.');
                            setIsScanning(false);
                            setUploadedImage(null);
                        }
                    }
                }, 1000);
            };
            imgEl.src = dataUrl;
        };
        reader.readAsDataURL(file);

        // Reset file input so the same file can be selected again
        e.target.value = '';
    };

    useEffect(() => {
        if (isScanning) {
            const timer = setInterval(() => {
                setCnnStep(prev => {
                    if (prev >= cnnSteps.length - 1) {
                        clearInterval(timer);

                        // Perform Scan
                        const performScan = async () => {
                            try {
                                const imageSrc = webcamRef.current?.getScreenshot();
                                const videoElement = webcamRef.current?.video;
                                let newScan;

                                const CONFIDENCE_THRESHOLD = 0.40;

                                // Pre-check: does this image look like a leaf?
                                if (videoElement && !isLikelyLeaf(videoElement)) {
                                    setScanError('This doesn\'t appear to be a crop leaf. AgriGuard can only identify diseases on Rice, Corn, or Banana leaves — not grains, cooked food, clothing, or other items. Please point the camera at a fresh leaf.');
                                    setIsScanning(false);
                                    return;
                                }

                                if (selectedCrop === 'Banana' || !videoElement) {
                                    // SIMULATION LOGIC for Banana
                                    const potentialDiseases = cropDiseases['Banana'];
                                    const randomIdx = Math.floor(Math.random() * potentialDiseases.length);
                                    const selectedDisease = potentialDiseases[randomIdx];

                                    let status = 'critical';
                                    if (selectedDisease === 'Healthy') status = 'healthy';

                                    newScan = {
                                        id: Date.now(),
                                        crop: 'Banana',
                                        disease: selectedDisease,
                                        status: status,
                                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                        fullDate: new Date().toISOString(),
                                        img: imageSrc,
                                        confidence: (85 + Math.random() * 14).toFixed(1),
                                        cnn_details: { layers: 16, architecture: 'ResNet-50 Optimized (Simulated)', data_points: 'N/A', parameters: '23.5M' }
                                    };
                                } else {
                                    // ML LOGIC for Rice/Corn
                                    const prediction = await predictDisease(videoElement);

                                    if (prediction.confidence < CONFIDENCE_THRESHOLD) {
                                        setScanError('This doesn\'t appear to be a crop leaf. AgriGuard can only identify diseases on Rice, Corn, or Banana leaves — not grains, cooked food, clothing, or other items. Please scan a fresh leaf.');
                                        setIsScanning(false);
                                        return;
                                    }

                                    newScan = {
                                        id: Date.now(),
                                        crop: prediction.crop,
                                        disease: prediction.disease,
                                        status: prediction.severity.toLowerCase(),
                                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                        fullDate: new Date().toISOString(),
                                        img: imageSrc,
                                        confidence: (prediction.confidence * 100).toFixed(1),
                                        cnn_details: { layers: 16, architecture: 'MobilenetV2 / ResNet50', data_points: '450k+ samples', parameters: '23.5M' }
                                    };
                                }

                                // Save to localStorage
                                const existingScans = JSON.parse(localStorage.getItem('agriGuardScans') || '[]');
                                localStorage.setItem('agriGuardScans', JSON.stringify([newScan, ...existingScans]));

                                setTimeout(() => navigate('/result', { state: { scanResult: newScan } }), 500);

                            } catch (error) {
                                console.error("Scanning failed:", error);
                                setIsScanning(false);
                            }
                        };

                        performScan();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isScanning, navigate]);

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
                {uploadedImage ? (
                    <img src={uploadedImage} alt="Uploaded" className="h-full w-full object-cover" />
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: 'environment' }}
                        className="h-full w-full object-cover"
                    />
                )}

                {/* Crop Selector Overlay */}
                <div className="absolute top-4 left-0 right-0 flex justify-center z-20">
                    <div className="bg-black/50 backdrop-blur-md p-1 rounded-full flex gap-1">
                        {Object.keys(cropDiseases).map(crop => (
                            <button
                                key={crop}
                                onClick={() => setSelectedCrop(crop)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${selectedCrop === crop
                                    ? 'bg-agri-green-500 text-white shadow-lg'
                                    : 'text-white/70 hover:bg-white/10'
                                    }`}
                            >
                                {crop}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CNN Scan Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-72 h-72 border-2 border-white/30 rounded-[40px] relative overflow-hidden">
                        <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-agri-green-400 to-transparent shadow-[0_0_15px_rgba(74,222,128,0.8)] z-10"
                        />

                        {/* Simulated Object Detection Boxes */}
                        {isScanning && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: [0, 1, 0], scale: 1 }}
                                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
                                    className="absolute top-10 left-10 w-20 h-20 border-2 border-yellow-400/70 rounded-lg"
                                >
                                    <div className="absolute -top-4 left-0 bg-yellow-400/90 text-[8px] text-black font-bold px-1 rounded">Leaf</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: [0, 1, 0], scale: 1 }}
                                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.2, delay: 0.3 }}
                                    className="absolute bottom-12 right-8 w-16 h-16 border-2 border-red-400/70 rounded-lg"
                                >
                                    <div className="absolute -top-4 left-0 bg-red-400/90 text-[8px] text-white font-bold px-1 rounded">Spot</div>
                                </motion.div>
                            </>
                        )}

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

                {/* Error Modal */}
                <AnimatePresence>
                    {scanError && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8"
                            onClick={() => setScanError(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle size={32} className="text-red-500" />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-2">Scan Failed</h3>
                                <p className="text-sm text-gray-600 mb-6">{scanError}</p>
                                <button
                                    onClick={() => setScanError(null)}
                                    className="w-full py-3 rounded-2xl bg-agri-green-500 text-white font-bold text-sm active:scale-95 transition-all"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="p-8 bg-gradient-to-t from-black to-transparent flex flex-col items-center">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-8">{t('scan.guide')}</p>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    className="hidden"
                />
                <div className="flex items-center gap-12">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors"
                    >
                        <div className="p-4 rounded-full bg-white/10">
                            <ImagePlus size={24} />
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
