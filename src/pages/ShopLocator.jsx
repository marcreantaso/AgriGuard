import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, Clock, Star, Navigation, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { agriShops } from '../constants/shops';

const ShopLocator = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');

    // Filter shops based on search and region
    const filteredShops = agriShops.filter(shop => {
        const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.municipality.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = selectedRegion === 'All' || shop.region === selectedRegion;
        return matchesSearch && matchesRegion;
    });

    const regions = ['All', ...new Set(agriShops.map(s => s.region))];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-inter">
            {/* Header */}
            <div className="bg-white px-6 pt-8 pb-4 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-gray-50 active:scale-95 transition-all text-gray-600"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                        {t('common.shops_nearby')}
                    </h1>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search shops or city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-agri-green-500"
                        />
                    </div>
                </div>

                {/* Region Filter Chips */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
                    {regions.map(region => (
                        <button
                            key={region}
                            onClick={() => setSelectedRegion(region)}
                            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide whitespace-nowrap transition-all ${selectedRegion === region
                                ? 'bg-agri-green-600 text-white shadow-lg shadow-agri-green-200'
                                : 'bg-white border border-gray-200 text-gray-600'
                                }`}
                        >
                            {region}
                        </button>
                    ))}
                </div>
            </div>

            {/* Shop List */}
            <div className="p-6 space-y-4">
                {filteredShops.map((shop, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={shop.id}
                        className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 relative overflow-hidden group active:scale-[0.98] transition-all"
                    >
                        {shop.verified && (
                            <div className="absolute top-0 right-0 bg-agri-green-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-2xl">
                                {t('common.verified_shop')}
                            </div>
                        )}

                        <div className="flex items-start justify-between mb-3 mt-2">
                            <div>
                                <h3 className="font-black text-gray-900 text-lg leading-tight mb-1">{shop.name}</h3>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-xs font-bold text-gray-600">{shop.rating}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">/ 5.0</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3 text-gray-600">
                                <MapPin size={16} className="mt-0.5 shrink-0 text-agri-green-600" />
                                <p className="text-xs font-medium leading-relaxed">{shop.address}</p>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Clock size={16} className="shrink-0 text-agri-green-600" />
                                <p className="text-xs font-medium">{t('common.open_until')} {shop.closesAt}</p>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone size={16} className="shrink-0 text-agri-green-600" />
                                <p className="text-xs font-medium">{shop.contact}</p>
                            </div>
                        </div>

                        {/* Inventory Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {shop.products.slice(0, 3).map((product, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-gray-100">
                                    {product}
                                </span>
                            ))}
                            {shop.products.length > 3 && (
                                <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-gray-100">
                                    +{shop.products.length - 3}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-700 text-xs font-black uppercase tracking-wide hover:bg-gray-100 transition-colors">
                                <Phone size={16} />
                                {t('common.call_shop')}
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-agri-green-600 text-white text-xs font-black uppercase tracking-wide shadow-lg shadow-agri-green-200 active:bg-agri-green-700 transition-colors">
                                <Navigation size={16} />
                                {t('common.get_directions')}
                            </button>
                        </div>
                    </motion.div>
                ))}

                {filteredShops.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <MapPin size={32} />
                        </div>
                        <p className="text-gray-500 font-bold text-sm">No shops found in this area</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopLocator;
