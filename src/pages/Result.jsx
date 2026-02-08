import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Share2, AlertCircle, CheckCircle, Info, ChevronDown, ChevronUp, ShoppingBag, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

// Collapsible Section Component
const Section = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-agri-green-50 flex items-center justify-center text-agri-green-600">
                        <Icon size={18} />
                    </div>
                    <span className="font-semibold text-gray-900">{title}</span>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 text-gray-600 text-sm border-t border-gray-50">
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
                    severity: "Critical",
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
            // Fallback if accessed directly
            navigate('/');
        }
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <div className="w-20 h-20 border-4 border-agri-green-100 border-t-agri-green-500 rounded-full animate-spin mb-6"></div>
                <h2 className="text-xl font-bold text-gray-900">Analyzing Crop...</h2>
                <p className="text-gray-500 mt-2">Our AI is checking for diseases.</p>
            </div>
        );
    }

    return (
        <div className="pb-24">
            {/* Top Image Section */}
            <div className="relative h-72 w-full bg-black">
                <img src={image} alt="Scanned Leaf" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center text-white">
                    <button onClick={() => navigate('/')} className="p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40">
                        <ArrowLeft size={24} />
                    </button>
                    <button className="p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40">
                        <Share2 size={24} />
                    </button>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                            {analysis.severity}
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full">
                            {analysis.probability}% Confidence
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-1">{analysis.disease}</h1>
                    <p className="text-gray-300 text-sm">Detected on {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className="px-4 -mt-6 relative z-10">
                <Section title="What it is" icon={AlertCircle} defaultOpen={true}>
                    <p className="leading-relaxed">{analysis.description}</p>
                </Section>

                <Section title="What to do now" icon={CheckCircle} defaultOpen={true}>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Immediately isolate infected plants if possible.</li>
                        <li>{analysis.treatment}</li>
                        <li>Monitor neighboring plants for symptoms.</li>
                    </ul>
                </Section>

                <Section title="Recommended Products" icon={ShoppingBag}>
                    <div className="space-y-3">
                        {analysis.products.map((product, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <h4 className="font-bold text-gray-900">{product.name}</h4>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <MapPin size={12} className="mr-1" />
                                        {product.distance} away
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-agri-green-600">{product.price}</div>
                                    <button className="text-xs text-agri-orange-500 font-medium">View Shop</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="primary" className="w-full mt-4 h-12">Find Stores Nearby</Button>
                </Section>

                <div className="mt-6 flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => navigate('/')}>Home</Button>
                    <Button variant="primary" className="flex-1" onClick={() => navigate('/scan')}>Scan Again</Button>
                </div>
            </div>
        </div>
    );
};

export default Result;
