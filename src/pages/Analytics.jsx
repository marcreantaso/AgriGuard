import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, BarChart3, Activity, Bug, MapPin, ShoppingCart, TrendingUp, TrendingDown, Minus, Leaf, Shield, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAll, STORES } from '../utils/db';

const Analytics = () => {
    const navigate = useNavigate();
    const [scans, setScans] = useState([]);
    const [visits, setVisits] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [safetyLogs, setSafetyLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const scanData = JSON.parse(localStorage.getItem('agriGuardScans') || '[]');
                setScans(scanData);
                setVisits(await getAll(STORES.FIELD_VISITS));
                setTransactions(await getAll(STORES.WALLET_TRANSACTIONS));
                setSafetyLogs(await getAll(STORES.SAFETY_LOGS));
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        load();
    }, []);

    // Disease breakdown from scan data
    const diseaseBreakdown = scans.reduce((acc, scan) => {
        const disease = scan.disease || 'Unknown';
        acc[disease] = (acc[disease] || 0) + 1;
        return acc;
    }, {});
    const maxDiseaseCount = Math.max(...Object.values(diseaseBreakdown), 1);
    const diseaseEntries = Object.entries(diseaseBreakdown).sort((a, b) => b[1] - a[1]);

    // Monthly scan activity
    const monthlyScans = Array(6).fill(0);
    const monthLabels = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        monthLabels.push(d.toLocaleDateString('en-PH', { month: 'short' }));
        const month = d.getMonth();
        const year = d.getFullYear();
        monthlyScans[5 - i] = scans.filter(s => {
            const sd = new Date(s.timestamp || s.time);
            return sd.getMonth() === month && sd.getFullYear() === year;
        }).length;
    }
    const maxMonthly = Math.max(...monthlyScans, 1);

    // Revenue from transactions
    const totalRevenue = transactions.filter(t => t.type === 'sale').reduce((s, t) => s + (t.grossAmount || 0), 0);
    const totalCommissions = transactions.filter(t => t.type === 'sale').reduce((s, t) => s + (t.commission || 0), 0);

    const summaryCards = [
        { label: 'Total Scans', value: scans.length, icon: Leaf, color: 'from-agri-green-500 to-agri-green-700', trend: 'up' },
        { label: 'Field Visits', value: visits.length, icon: MapPin, color: 'from-agri-blue-500 to-agri-blue-700', trend: 'neutral' },
        { label: 'Crop Sales', value: transactions.filter(t => t.type === 'sale').length, icon: ShoppingCart, color: 'from-agri-purple-500 to-agri-purple-700', trend: 'up' },
        { label: 'Safety Reports', value: safetyLogs.length, icon: Shield, color: 'from-agri-red-500 to-agri-red-700', trend: 'neutral' },
    ];

    const TrendIcon = ({ trend }) => {
        if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-400" />;
        if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-400" />;
        return <Minus className="w-3 h-3 text-gray-400" />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-agri-amber-100 border-t-agri-amber-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="pb-28 px-1 pt-2">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Analytics</h1>
                    <p className="text-xs text-gray-400 font-medium">Farm performance dashboard</p>
                </div>
                <div className="w-10 h-10 bg-agri-amber-50 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-agri-amber-600" />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {summaryCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 text-white relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-6 -mt-6 blur-xl" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <Icon className="w-5 h-5 opacity-70" />
                                    <TrendIcon trend={card.trend} />
                                </div>
                                <p className="text-2xl font-black">{card.value}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{card.label}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Revenue Summary */}
            {totalRevenue > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 mb-6"
                >
                    <h3 className="font-black text-gray-900 tracking-tight mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-agri-amber-500" /> Revenue Overview
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <p className="text-lg font-black text-agri-green-600">₱{(totalRevenue / 1000).toFixed(1)}k</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">Gross Sales</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-black text-agri-orange-500">₱{(totalCommissions / 1000).toFixed(1)}k</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">Fees (5%)</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-black text-agri-purple-600">₱{((totalRevenue - totalCommissions) / 1000).toFixed(1)}k</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">Net Earned</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Disease Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 mb-6"
            >
                <h3 className="font-black text-gray-900 tracking-tight mb-4 flex items-center gap-2">
                    <Bug className="w-4 h-4 text-agri-red-500" /> Disease Detection
                </h3>
                {diseaseEntries.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No scan data yet. Start scanning crops!</p>
                ) : (
                    <div className="space-y-3">
                        {diseaseEntries.slice(0, 8).map(([disease, count], idx) => (
                            <div key={disease} className="flex items-center gap-3">
                                <span className="text-xs text-gray-600 font-medium w-28 truncate">{disease}</span>
                                <div className="flex-1 bg-gray-50 rounded-full h-3 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(count / maxDiseaseCount) * 100}%` }}
                                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                                        className={`h-full rounded-full ${disease === 'Healthy' ? 'bg-agri-green-500' : 'bg-agri-red-500'}`}
                                    />
                                </div>
                                <span className="text-xs font-bold text-gray-800 w-6 text-right">{count}</span>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Monthly Activity Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 mb-6"
            >
                <h3 className="font-black text-gray-900 tracking-tight mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-agri-blue-500" /> Monthly Scans
                </h3>
                <div className="flex items-end gap-2 h-32">
                    {monthlyScans.map((count, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[9px] font-bold text-gray-500">{count}</span>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max((count / maxMonthly) * 100, 4)}%` }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                className="w-full bg-gradient-to-t from-agri-blue-500 to-agri-blue-300 rounded-lg min-h-[4px]"
                            />
                            <span className="text-[9px] font-bold text-gray-400">{monthLabels[idx]}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Safety Summary */}
            {safetyLogs.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50"
                >
                    <h3 className="font-black text-gray-900 tracking-tight mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-agri-red-500" /> Safety Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(
                            safetyLogs.reduce((acc, log) => {
                                acc[log.severity] = (acc[log.severity] || 0) + 1;
                                return acc;
                            }, {})
                        ).map(([severity, count]) => (
                            <div key={severity} className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                                <span className={`w-3 h-3 rounded-full ${severity === 'Critical' ? 'bg-red-500' : severity === 'High' ? 'bg-orange-500' : severity === 'Medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                                <span className="text-xs text-gray-600 font-medium">{severity}</span>
                                <span className="text-sm font-black text-gray-800 ml-auto">{count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Analytics;
