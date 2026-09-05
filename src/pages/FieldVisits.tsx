import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Camera, Calendar, Leaf, ChevronLeft, X, Check, Clock, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { getAll, add, remove, STORES } from '../utils/db';

const CROP_TYPES = ['Rice (Palay)', 'Corn (Mais)', 'Vegetables', 'Coconut', 'Sugarcane', 'Banana', 'Mango', 'Other'];
const VISIT_TYPES = ['Routine Inspection', 'Planting', 'Harvesting', 'Fertilizer Application', 'Pest Monitoring', 'Irrigation Check', 'Soil Testing'];

const FieldVisits = () => {
    const navigate = useNavigate();
    const { location: gpsLocation } = useLocation();
    const [visits, setVisits] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    // Form state
    const [form, setForm] = useState({
        cropType: CROP_TYPES[0],
        visitType: VISIT_TYPES[0],
        notes: '',
        photos: [],
        severity: 'Normal',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadVisits();
    }, []);

    const loadVisits = async () => {
        try {
            const data = await getAll(STORES.FIELD_VISITS);
            setVisits(data.sort((a, b) => b.timestamp - a.timestamp));
        } catch (e) {
            console.error('Failed to load visits:', e);
        }
        setLoading(false);
    };

    const handlePhotoCapture = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setForm(prev => ({ ...prev, photos: [...prev.photos, ev.target.result] }));
        };
        reader.readAsDataURL(file);
    };

    const removePhoto = (index) => {
        setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async () => {
        if (saving) return;
        setSaving(true);
        try {
            const visit = {
                ...form,
                lat: gpsLocation?.latitude || 14.5995,
                lng: gpsLocation?.longitude || 120.9842,
                timestamp: Date.now(),
            };
            await add(STORES.FIELD_VISITS, visit);
            setForm({ cropType: CROP_TYPES[0], visitType: VISIT_TYPES[0], notes: '', photos: [], severity: 'Normal' });
            setShowForm(false);
            await loadVisits();
        } catch (e) {
            console.error('Failed to save visit:', e);
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        await remove(STORES.FIELD_VISITS, id);
        await loadVisits();
    };

    const formatDate = (ts) => {
        const d = new Date(ts);
        return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const severityColor = (s) => {
        switch (s) {
            case 'Critical': return 'bg-red-500';
            case 'Warning': return 'bg-orange-500';
            case 'Good': return 'bg-green-500';
            default: return 'bg-blue-500';
        }
    };

    return (
        <div className="pb-28 px-1 pt-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Field Visits</h1>
                        <p className="text-xs text-gray-400 font-medium">GPS-tagged farm inspections</p>
                    </div>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowForm(true)}
                    className="w-12 h-12 bg-agri-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-agri-green-200 text-white"
                >
                    <Plus className="w-6 h-6" />
                </motion.button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                    { label: 'Total Visits', value: visits.length, color: 'bg-agri-green-500' },
                    { label: 'This Month', value: visits.filter(v => new Date(v.timestamp).getMonth() === new Date().getMonth()).length, color: 'bg-agri-blue-500' },
                    { label: 'Flagged', value: visits.filter(v => v.severity === 'Critical' || v.severity === 'Warning').length, color: 'bg-agri-orange-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-50 text-center">
                        <div className={`w-8 h-8 ${stat.color} rounded-xl flex items-center justify-center text-white text-sm font-bold mx-auto mb-1`}>
                            {stat.value}
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Visits List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-agri-green-100 border-t-agri-green-500 rounded-full animate-spin" />
                </div>
            ) : visits.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-agri-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-10 h-10 text-agri-green-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No Field Visits Yet</h3>
                    <p className="text-sm text-gray-400">Tap the + button to log your first farm visit</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {visits.map((visit, idx) => (
                        <motion.div
                            key={visit.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden"
                        >
                            <div className="flex">
                                {visit.photos?.[0] && (
                                    <div className="w-24 h-24 flex-shrink-0">
                                        <img src={visit.photos[0]} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`w-2 h-2 rounded-full ${severityColor(visit.severity)}`} />
                                                <h4 className="font-bold text-gray-900 text-sm">{visit.visitType}</h4>
                                            </div>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Leaf className="w-3 h-3" /> {visit.cropType}
                                            </p>
                                        </div>
                                        <button onClick={() => handleDelete(visit.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {visit.notes && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{visit.notes}</p>}
                                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(visit.timestamp)}</span>
                                        <span className="flex items-center gap-1"><Navigation className="w-3 h-3" />{visit.lat?.toFixed(4)}, {visit.lng?.toFixed(4)}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Visit Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
                                <h2 className="text-xl font-black text-gray-900 mb-6">Log Field Visit</h2>

                                {/* GPS Tag */}
                                <div className="bg-agri-green-50 rounded-2xl p-4 mb-5 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-agri-green-500 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-agri-green-700 uppercase tracking-wider">GPS Location</p>
                                        <p className="text-sm text-agri-green-600 font-medium">
                                            {gpsLocation ? `${gpsLocation.latitude.toFixed(6)}, ${gpsLocation.longitude.toFixed(6)}` : 'Detecting location...'}
                                        </p>
                                    </div>
                                    <div className="ml-auto w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                </div>

                                {/* Visit Type */}
                                <label className="block mb-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Visit Type</span>
                                    <select
                                        value={form.visitType}
                                        onChange={(e) => setForm(f => ({ ...f, visitType: e.target.value }))}
                                        className="w-full bg-gray-50 rounded-xl p-3 text-sm font-medium text-gray-800 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-agri-green-500"
                                    >
                                        {VISIT_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </label>

                                {/* Crop Type */}
                                <label className="block mb-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Crop Type</span>
                                    <select
                                        value={form.cropType}
                                        onChange={(e) => setForm(f => ({ ...f, cropType: e.target.value }))}
                                        className="w-full bg-gray-50 rounded-xl p-3 text-sm font-medium text-gray-800 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-agri-green-500"
                                    >
                                        {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </label>

                                {/* Severity */}
                                <label className="block mb-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Field Condition</span>
                                    <div className="flex gap-2">
                                        {['Good', 'Normal', 'Warning', 'Critical'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setForm(f => ({ ...f, severity: s }))}
                                                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${form.severity === s
                                                    ? `${severityColor(s)} text-white shadow-md`
                                                    : 'bg-gray-50 text-gray-400 border border-gray-100'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </label>

                                {/* Notes */}
                                <label className="block mb-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Notes</span>
                                    <textarea
                                        value={form.notes}
                                        onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                                        placeholder="Describe what you observed..."
                                        rows={3}
                                        className="w-full bg-gray-50 rounded-xl p-3 text-sm text-gray-800 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-agri-green-500 resize-none"
                                    />
                                </label>

                                {/* Photo Capture */}
                                <div className="mb-6">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Photos</span>
                                    <div className="flex gap-3 flex-wrap">
                                        {form.photos.map((photo, i) => (
                                            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-agri-green-200">
                                                <img src={photo} alt="" className="w-full h-full object-cover" />
                                                <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                    <X className="w-3 h-3 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-agri-green-300 hover:text-agri-green-500 transition-colors"
                                        >
                                            <Camera className="w-6 h-6" />
                                            <span className="text-[9px] font-bold mt-1">ADD</span>
                                        </button>
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture} />
                                </div>

                                {/* Submit */}
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    className="w-full bg-agri-green-500 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-agri-green-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Save Visit
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FieldVisits;
