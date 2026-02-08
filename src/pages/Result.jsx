import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, AlertCircle, CheckCircle, ShoppingBag, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

// Collapsible Section Component
const Section = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-4 shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left active:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-agri-green-50 flex items-center justify-center text-agri-green-600">
                        <Icon size={20} />
                    </div>
                    <span className="font-bold text-gray-900">{title}</span>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-50/50">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Result = () => {
    const navigate = useNavigate();
    const { language, t } = useLanguage();
    const [image, setImage] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedImage = localStorage.getItem('currentScan');
        if (storedImage) {
            setImage(storedImage);
            // Simulate AI Analysis
            setTimeout(() => {
                setAnalysis({
                    disease: "Rice Blast",
                    probability: 94,
                    severity: "critical",
                    description: "Rice blast is caused by the fungus Magnaporthe oryzae. It can affect all above-ground parts of the rice plant.",
                    treatment: "Use balanced amounts of nitrogen fertilizer. Keep the field flooded as deep as possible.",
                    products: [
                        { name: "Fuji-One 40EC", price: "₱450", distance: "2.5km" },
                        { name: "BlastOff Fungicide", price: "₱380", distance: "4.1km" }
                    ]
                });
                setLoading(false);
            }, 1500);
        } else {
            navigate('/');
        }
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-16 h-16 border-4 border-agri-green-100 border-t-agri-green-500 rounded-full mb-6"
                />
                <h2 className="text-xl font-bold text-gray-900">{t('scan.scanning')}</h2>
                <p className="text-gray-500 mt-2 text-sm">Protecting your harvest with AI</p>
            </div>
        );
    }

    return (
        <div className="pb-28 bg-gray-50/30 min-h-screen">
            {/* Top Image Section */}
            <div className="relative h-80 w-full bg-black overflow-hidden">
                <img src={image} alt="Scanned Leaf" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center text-white z-20">
                    <button onClick={() => navigate('/')} className="p-2.5 bg-black/30 backdrop-blur-md rounded-full hover:bg-black/50 active:scale-90 transition-all">
                        <ArrowLeft size={24} />
                    </button>
                    <button className="p-2.5 bg-black/30 backdrop-blur-md rounded-full hover:bg-black/50 active:scale-90 transition-all">
                        <Share2 size={24} />
                    </button>
                </div>

                <div className="absolute bottom-8 left-6 right-6 z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest ${analysis.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                            }`}>
                            {t(`result.severity.${analysis.severity}`)}
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/10 uppercase tracking-wider">
                            {analysis.probability}% {t('result.confidence')}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{analysis.disease}</h1>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wider">
                        {t('result.detected_on')} {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'tl-PH')}
                    </p>
                </div>
            </div>

            <div className="px-5 -mt-6 relative z-10">
                <Section title={t('result.description_label')} icon={AlertCircle} defaultOpen={true}>
                    <p>{analysis.description}</p>
                </Section>

                <Section title={t('result.treatment_label')} icon={CheckCircle} defaultOpen={true}>
                    <ul className="list-disc pl-5 space-y-3">
                        <li>Immediately isolate infected plants if possible.</li>
                        <li>{analysis.treatment}</li>
                        <li>Monitor neighboring plants for symptoms.</li>
                    </ul>
                </Section>

                <Section title={t('result.products_label')} icon={ShoppingBag}>
                    <div className="space-y-4">
                        {analysis.products.map((product, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <h4 className="font-bold text-gray-900">{product.name}</h4>
                                    <div className="flex items-center text-[10px] text-gray-500 mt-1 font-medium">
                                        <MapPin size={12} className="mr-1 text-agri-green-500" />
                                        {product.distance} {t('common.away')}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-agri-green-600 mb-1">{product.price}</div>
                                    <button className="text-[10px] text-white bg-agri-orange-500 px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm shadow-agri-orange-200 active:scale-95 transition-all">
                                        {t('common.view_shop')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="primary" className="w-full mt-6 h-14 rounded-2xl shadow-lg shadow-agri-green-100">
                        {t('common.find_stores')}
                    </Button>
                </Section>

                <div className="mt-8 flex gap-4">
                    <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => navigate('/')}>
                        {t('common.home')}
                    </Button>
                    <Button variant="primary" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => navigate('/scan')}>
                        {t('common.scan_again')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Result;
