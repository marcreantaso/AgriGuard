import React, { useState } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { ChevronLeft, MapPin, Star, Shield, Check, AlertTriangle, Banknote, User, Phone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { add, STORES } from '../utils/db';

const MarketplaceDetail = () => {
    const navigate = useNavigate();
    const routerLocation = useRouterLocation();
    const offer = routerLocation.state?.offer;

    const [showConfirm, setShowConfirm] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [accepting, setAccepting] = useState(false);
    const [accepted, setAccepted] = useState(false);

    if (!offer) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-500">Offer not found</p>
                    <button onClick={() => navigate('/marketplace')} className="mt-4 text-agri-blue-500 font-bold text-sm">Back to Marketplace</button>
                </div>
            </div>
        );
    }

    const qty = parseFloat(quantity) || 0;
    const grossTotal = qty * offer.pricePerKg;
    const commission = grossTotal * 0.05;
    const netPayout = grossTotal - commission;

    const handleAccept = async () => {
        if (qty <= 0 || qty > offer.quantityKg) return;
        setAccepting(true);

        // Simulate processing
        await new Promise(r => setTimeout(r, 2000));

        // Save transaction to wallet
        await add(STORES.WALLET_TRANSACTIONS, {
            type: 'sale',
            description: `Sold ${qty}kg ${offer.crop} to ${offer.buyer}`,
            amount: netPayout,
            commission: commission,
            grossAmount: grossTotal,
            crop: offer.crop,
            buyer: offer.buyer,
            quantityKg: qty,
            timestamp: Date.now(),
        });

        setAccepting(false);
        setAccepted(true);
    };

    return (
        <div className="pb-28 px-1 pt-2">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <button onClick={() => navigate('/marketplace')} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">Offer Details</h1>
                    <p className="text-xs text-gray-400 font-medium">Review and accept</p>
                </div>
            </div>

            {/* Success State */}
            {accepted ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="w-24 h-24 bg-agri-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-12 h-12 text-agri-green-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Offer Accepted!</h2>
                    <p className="text-sm text-gray-500 mb-1">Transaction recorded successfully</p>
                    <p className="text-2xl font-black text-agri-green-600 mb-8">₱{netPayout.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-gray-400 mb-8">credited to your AgriGuard Wallet</p>
                    <div className="flex gap-3 max-w-sm mx-auto">
                        <button onClick={() => navigate('/wallet')} className="flex-1 bg-agri-purple-500 text-white py-3 rounded-2xl font-bold text-sm">
                            View Wallet
                        </button>
                        <button onClick={() => navigate('/marketplace')} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold text-sm">
                            More Offers
                        </button>
                    </div>
                </motion.div>
            ) : (
                <>
                    {/* Offer Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden mb-5">
                        <div className="bg-gradient-to-br from-agri-blue-500 to-agri-blue-700 p-6 text-white">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
                                    {offer.image}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black">{offer.crop}</h2>
                                    <p className="text-blue-100 text-sm">{offer.buyer}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex items-end justify-between">
                                <div>
                                    <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Price per kg</p>
                                    <p className="text-3xl font-black">₱{offer.pricePerKg.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Quantity Needed</p>
                                    <p className="text-xl font-black">{(offer.quantityKg / 1000).toFixed(1)}T</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center"><MapPin className="w-4 h-4 text-gray-400" /></div>
                                <div><p className="text-[10px] text-gray-400 uppercase font-bold">Location</p><p className="text-sm font-medium text-gray-800">{offer.location}</p></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center"><Star className="w-4 h-4 text-amber-400" /></div>
                                <div><p className="text-[10px] text-gray-400 uppercase font-bold">Buyer Rating</p><p className="text-sm font-medium text-gray-800">{offer.rating}/5.0 — Verified Buyer</p></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center"><Shield className="w-4 h-4 text-agri-green-500" /></div>
                                <div><p className="text-[10px] text-gray-400 uppercase font-bold">Payment Protection</p><p className="text-sm font-medium text-gray-800">AgriGuard Secure Transaction</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Input */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 mb-5">
                        <label className="block mb-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Your quantity (kg)</span>
                            <input
                                type="number"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                placeholder={`Max ${offer.quantityKg.toLocaleString()} kg`}
                                max={offer.quantityKg}
                                min={1}
                                className="w-full bg-gray-50 rounded-xl p-3 text-lg font-bold text-gray-800 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-agri-blue-500"
                            />
                        </label>

                        {qty > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Gross Total</span>
                                    <span className="font-bold text-gray-800">₱{grossTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3 text-agri-orange-500" />
                                        Platform Fee (5%)
                                    </span>
                                    <span className="font-bold text-agri-orange-500">-₱{commission.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-gray-800">Net Payout</span>
                                    <span className="text-xl font-black text-agri-green-600">₱{netPayout.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Accept Button */}
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => qty > 0 && setShowConfirm(true)}
                        disabled={qty <= 0 || qty > offer.quantityKg}
                        className="w-full bg-agri-blue-500 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-agri-blue-200 disabled:opacity-30 flex items-center justify-center gap-2"
                    >
                        <Banknote className="w-5 h-5" /> Accept Offer
                    </motion.button>

                    {/* Confirm Modal */}
                    <AnimatePresence>
                        {showConfirm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
                                onClick={() => setShowConfirm(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    onClick={e => e.stopPropagation()}
                                    className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
                                >
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-agri-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                            {offer.image}
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900">Confirm Sale</h3>
                                        <p className="text-xs text-gray-400 mt-1">This action cannot be undone</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-4 space-y-2 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Crop</span>
                                            <span className="font-bold text-gray-800">{offer.crop}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Buyer</span>
                                            <span className="font-bold text-gray-800">{offer.buyer}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Quantity</span>
                                            <span className="font-bold text-gray-800">{qty.toLocaleString()} kg</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-2 flex justify-between">
                                            <span className="font-bold text-gray-800">You Receive</span>
                                            <span className="text-lg font-black text-agri-green-600">₱{netPayout.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setShowConfirm(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold text-sm">Cancel</button>
                                        <button
                                            onClick={() => { setShowConfirm(false); handleAccept(); }}
                                            disabled={accepting}
                                            className="flex-1 bg-agri-green-500 text-white py-3 rounded-2xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {accepting ?
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                                                <>
                                                    <Check className="w-4 h-4" /> Confirm
                                                </>
                                            }
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
};

export default MarketplaceDetail;
