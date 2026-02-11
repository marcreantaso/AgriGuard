import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, ChevronLeft, ShoppingCart, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAll, add, STORES } from '../utils/db';

// Seed data — realistic Filipino crop market offers
const SEED_OFFERS = [
    { id: 'offer_1', crop: 'Palay (Rice)', buyer: 'NFA Central Luzon', pricePerKg: 23.50, quantityKg: 5000, location: 'Cabanatuan, Nueva Ecija', rating: 4.8, posted: Date.now() - 86400000 * 2, status: 'open', category: 'Rice', image: '🌾' },
    { id: 'offer_2', crop: 'Mais (Corn)', buyer: 'San Miguel Foods', pricePerKg: 15.00, quantityKg: 10000, location: 'Isabela', rating: 4.9, posted: Date.now() - 86400000 * 1, status: 'open', category: 'Corn', image: '🌽' },
    { id: 'offer_3', crop: 'Kamatis (Tomato)', buyer: 'Jollibee Supply Chain', pricePerKg: 45.00, quantityKg: 2000, location: 'Pangasinan', rating: 4.7, posted: Date.now() - 86400000 * 3, status: 'open', category: 'Vegetables', image: '🍅' },
    { id: 'offer_4', crop: 'Sibuyas (Onion)', buyer: 'Metro Supermarket', pricePerKg: 85.00, quantityKg: 3000, location: 'Nueva Ecija', rating: 4.5, posted: Date.now() - 86400000 * 4, status: 'open', category: 'Vegetables', image: '🧅' },
    { id: 'offer_5', crop: 'Niyog (Coconut)', buyer: 'Peter Paul Corp.', pricePerKg: 12.00, quantityKg: 20000, location: 'Quezon Province', rating: 4.6, posted: Date.now() - 86400000, status: 'open', category: 'Fruits', image: '🥥' },
    { id: 'offer_6', crop: 'Saging (Banana)', buyer: 'Dole Philippines', pricePerKg: 22.00, quantityKg: 8000, location: 'Davao del Sur', rating: 4.9, posted: Date.now() - 86400000 * 5, status: 'open', category: 'Fruits', image: '🍌' },
    { id: 'offer_7', crop: 'Tubo (Sugarcane)', buyer: 'Universal Robina Corp.', pricePerKg: 8.50, quantityKg: 30000, location: 'Tarlac', rating: 4.4, posted: Date.now() - 86400000 * 6, status: 'open', category: 'Other', image: '🎋' },
    { id: 'offer_8', crop: 'Mangga (Mango)', buyer: 'Profood International', pricePerKg: 65.00, quantityKg: 5000, location: 'Guimaras', rating: 4.8, posted: Date.now() - 86400000 * 2, status: 'open', category: 'Fruits', image: '🥭' },
    { id: 'offer_9', crop: 'Palay (Rice)', buyer: 'Bagong Bayan Coop', pricePerKg: 25.00, quantityKg: 3000, location: 'Bulacan', rating: 4.3, posted: Date.now() - 86400000 * 7, status: 'open', category: 'Rice', image: '🌾' },
    { id: 'offer_10', crop: 'Talong (Eggplant)', buyer: 'Puregold', pricePerKg: 40.00, quantityKg: 1500, location: 'Batangas', rating: 4.6, posted: Date.now() - 86400000 * 3, status: 'open', category: 'Vegetables', image: '🍆' },
];

const CATEGORIES = ['All', 'Rice', 'Corn', 'Vegetables', 'Fruits', 'Other'];

const Marketplace = () => {
    const navigate = useNavigate();
    const [offers, setOffers] = useState(SEED_OFFERS);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredOffers = offers.filter(o => {
        const matchesSearch = o.crop.toLowerCase().includes(search.toLowerCase()) ||
            o.buyer.toLowerCase().includes(search.toLowerCase()) ||
            o.location.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'All' || o.category === activeCategory;
        return matchesSearch && matchesCategory && o.status === 'open';
    });

    const timeAgo = (ts) => {
        const hours = Math.floor((Date.now() - ts) / 3600000);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className="pb-28 px-1 pt-2">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <button onClick={() => navigate('/')} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Marketplace</h1>
                    <p className="text-xs text-gray-400 font-medium">Real-time buyer offers for your harvest</p>
                </div>
                <div className="w-10 h-10 bg-agri-blue-50 rounded-2xl flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-agri-blue-500" />
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search crops, buyers, locations..."
                    className="w-full bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm text-gray-800 shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-agri-blue-500"
                />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${activeCategory === cat
                            ? 'bg-agri-blue-500 text-white shadow-md shadow-agri-blue-200'
                            : 'bg-white text-gray-400 border border-gray-100'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between mb-4 px-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{filteredOffers.length} Active Offers</p>
                <div className="flex items-center gap-1 text-xs text-agri-green-600 font-bold">
                    <TrendingUp className="w-3 h-3" /> Live
                </div>
            </div>

            {/* Offers List */}
            <div className="space-y-3">
                {filteredOffers.map((offer, idx) => (
                    <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => navigate(`/marketplace/${offer.id}`, { state: { offer } })}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 active:scale-[0.98] transition-transform cursor-pointer"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-agri-blue-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                                {offer.image}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{offer.crop}</h3>
                                        <p className="text-xs text-gray-500">{offer.buyer}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-agri-green-600">₱{offer.pricePerKg.toFixed(2)}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">per kg</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {offer.location}
                                    </span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-400" /> {offer.rating}
                                    </span>
                                    <span className="text-[10px] text-gray-400 ml-auto">{timeAgo(offer.posted)}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 bg-gray-50 rounded-full h-1.5">
                                <div className="bg-agri-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.random() * 60 + 20)}%` }} />
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold">{(offer.quantityKg / 1000).toFixed(0)}T needed</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredOffers.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-agri-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-10 h-10 text-agri-blue-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No Offers Found</h3>
                    <p className="text-sm text-gray-400">Try a different search or category</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
