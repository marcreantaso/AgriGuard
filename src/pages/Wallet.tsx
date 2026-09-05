import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, Banknote, CreditCard, Clock, TrendingUp, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAll, add, STORES } from '../utils/db';

const Wallet = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPayout, setShowPayout] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [payoutMethod, setPayoutMethod] = useState('gcash');
    const [payoutProcessing, setPayoutProcessing] = useState(false);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const data = await getAll(STORES.WALLET_TRANSACTIONS);
            setTransactions(data.sort((a, b) => b.timestamp - a.timestamp));
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const balance = transactions.reduce((sum, tx) => {
        if (tx.type === 'sale') return sum + tx.amount;
        if (tx.type === 'payout') return sum - tx.amount;
        return sum;
    }, 0);

    const totalEarnings = transactions.filter(t => t.type === 'sale').reduce((s, t) => s + t.amount, 0);
    const totalCommissions = transactions.filter(t => t.type === 'sale').reduce((s, t) => s + (t.commission || 0), 0);

    const handlePayout = async () => {
        const amt = parseFloat(payoutAmount);
        if (!amt || amt <= 0 || amt > balance) return;
        setPayoutProcessing(true);
        await new Promise(r => setTimeout(r, 2000));

        await add(STORES.WALLET_TRANSACTIONS, {
            type: 'payout',
            description: `Payout via ${payoutMethod === 'gcash' ? 'GCash' : payoutMethod === 'maya' ? 'Maya' : 'Bank Transfer'}`,
            amount: amt,
            method: payoutMethod,
            status: 'processing',
            timestamp: Date.now(),
        });

        setPayoutProcessing(false);
        setShowPayout(false);
        setPayoutAmount('');
        await loadTransactions();
    };

    const formatDate = (ts) => {
        return new Date(ts).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="pb-28 px-1 pt-2">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Wallet</h1>
                    <p className="text-xs text-gray-400 font-medium">Your digital farm earnings</p>
                </div>
            </div>

            {/* Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-agri-purple-500 via-agri-purple-600 to-agri-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-agri-purple-200 mb-6 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <WalletIcon className="w-5 h-5 text-purple-200" />
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-200">Available Balance</span>
                    </div>
                    <motion.p
                        key={balance}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-black mb-6"
                    >
                        ₱{balance.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </motion.p>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
                        <div>
                            <p className="text-[10px] text-purple-200 font-bold uppercase tracking-tighter">Total Earned</p>
                            <p className="font-bold text-sm">₱{totalEarnings.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-purple-200 font-bold uppercase tracking-tighter">Fees Paid</p>
                            <p className="font-bold text-sm">₱{totalCommissions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowPayout(true)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-3"
                >
                    <div className="w-10 h-10 bg-agri-green-50 rounded-xl flex items-center justify-center">
                        <Send className="w-5 h-5 text-agri-green-500" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-sm text-gray-900">Cash Out</p>
                        <p className="text-[10px] text-gray-400">GCash / Maya</p>
                    </div>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/marketplace')}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-3"
                >
                    <div className="w-10 h-10 bg-agri-blue-50 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-agri-blue-500" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-sm text-gray-900">Sell Crops</p>
                        <p className="text-[10px] text-gray-400">Marketplace</p>
                    </div>
                </motion.button>
            </div>

            {/* Transaction History */}
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-black text-gray-900 tracking-tight">Transactions</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{transactions.length} total</span>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-agri-purple-100 border-t-agri-purple-500 rounded-full animate-spin" />
                </div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-agri-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <WalletIcon className="w-8 h-8 text-agri-purple-300" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">No Transactions Yet</h4>
                    <p className="text-xs text-gray-400">Sell crops in the marketplace to start earning</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {transactions.map((tx, idx) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-4"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'sale' ? 'bg-green-50' : 'bg-red-50'}`}>
                                {tx.type === 'sale'
                                    ? <ArrowDownRight className="w-5 h-5 text-green-500" />
                                    : <ArrowUpRight className="w-5 h-5 text-red-500" />
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-gray-900 truncate">{tx.description}</p>
                                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {formatDate(tx.timestamp)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`font-black text-sm ${tx.type === 'sale' ? 'text-green-600' : 'text-red-500'}`}>
                                    {tx.type === 'sale' ? '+' : '-'}₱{tx.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                </p>
                                {tx.commission > 0 && <p className="text-[10px] text-gray-400">fee: ₱{tx.commission.toFixed(2)}</p>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Payout Modal */}
            <AnimatePresence>
                {showPayout && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center"
                        onClick={() => setShowPayout(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-t-3xl w-full max-w-lg p-6"
                        >
                            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
                            <h3 className="text-xl font-black text-gray-900 mb-1">Cash Out</h3>
                            <p className="text-xs text-gray-400 mb-6">Available: ₱{balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>

                            <label className="block mb-4">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Amount</span>
                                <input
                                    type="number"
                                    value={payoutAmount}
                                    onChange={e => setPayoutAmount(e.target.value)}
                                    placeholder="₱0.00"
                                    max={balance}
                                    className="w-full bg-gray-50 rounded-xl p-3 text-xl font-bold text-gray-800 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-agri-purple-500"
                                />
                            </label>

                            <div className="mb-6">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Method</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'gcash', label: 'GCash', icon: '💚' },
                                        { id: 'maya', label: 'Maya', icon: '💜' },
                                        { id: 'bank', label: 'Bank', icon: '🏦' },
                                    ].map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => setPayoutMethod(m.id)}
                                            className={`p-3 rounded-xl text-center transition-all ${payoutMethod === m.id
                                                ? 'bg-agri-purple-500 text-white shadow-md'
                                                : 'bg-gray-50 text-gray-600 border border-gray-100'
                                                }`}
                                        >
                                            <span className="text-xl block mb-1">{m.icon}</span>
                                            <span className="text-xs font-bold">{m.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handlePayout}
                                disabled={payoutProcessing || !payoutAmount || parseFloat(payoutAmount) > balance || parseFloat(payoutAmount) <= 0}
                                className="w-full bg-agri-purple-500 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-agri-purple-200 disabled:opacity-30 flex items-center justify-center gap-2"
                            >
                                {payoutProcessing ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" /> Request Payout
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Wallet;
