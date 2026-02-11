import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, AlertTriangle, Shield, Phone, Camera, X, Check, Clock, MapPin, Flame, Zap, Bug, Skull, Heart, HardHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { getAll, add, remove, STORES } from '../utils/db';

const INCIDENT_TYPES = [
    { id: 'pesticide', label: 'Pesticide Exposure', icon: Skull, color: 'bg-red-500' },
    { id: 'equipment', label: 'Equipment Accident', icon: HardHat, color: 'bg-orange-500' },
    { id: 'heat', label: 'Heat Illness', icon: Flame, color: 'bg-amber-500' },
    { id: 'chemical', label: 'Chemical Burn', icon: Zap, color: 'bg-purple-500' },
    { id: 'animal', label: 'Animal Injury', icon: Bug, color: 'bg-green-600' },
    { id: 'other', label: 'Other Incident', icon: AlertTriangle, color: 'bg-gray-500' },
];

const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

const SafetyLogs = () => {
    const navigate = useNavigate();
    const { location: gpsLocation } = useLocation();
    const [logs, setLogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        type: 'pesticide',
        severity: 'Medium',
        description: '',
        affectedCount: 1,
        photos: [],
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadLogs(); }, []);

    const loadLogs = async () => {
        try {
            const data = await getAll(STORES.SAFETY_LOGS);
            setLogs(data.sort((a, b) => b.timestamp - a.timestamp));
        } catch (e) { console.error(e); }
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

    const handleSubmit = async () => {
        if (saving || !form.description.trim()) return;
        setSaving(true);
        try {
            await add(STORES.SAFETY_LOGS, {
                ...form,
                lat: gpsLocation?.latitude || 14.5995,
                lng: gpsLocation?.longitude || 120.9842,
                timestamp: Date.now(),
            });
            setForm({ type: 'pesticide', severity: 'Medium', description: '', affectedCount: 1, photos: [] });
            setShowForm(false);
            await loadLogs();
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        await remove(STORES.SAFETY_LOGS, id);
        await loadLogs();
    };

    const getIncidentType = (typeId) => INCIDENT_TYPES.find(t => t.id === typeId) || INCIDENT_TYPES[5];

    const formatDate = (ts) => new Date(ts).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const severityColor = (s) => {
        switch (s) {
            case 'Critical': return 'bg-red-500 text-white';
            case 'High': return 'bg-orange-500 text-white';
            case 'Medium': return 'bg-amber-500 text-white';
            default: return 'bg-green-500 text-white';
        }
    };

    const emergencyContacts = [
        { name: 'PH Emergency', number: '911', icon: '🚨' },
        { name: 'Poison Control', number: '(02) 8524-1078', icon: '☠️' },
        { name: 'Red Cross PH', number: '143', icon: '🏥' },
    ];

    return (
        <div className="pb-28 px-1 pt-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Safety Logs</h1>
                        <p className="text-xs text-gray-400 font-medium">Farm health & incident reports</p>
                    </div>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowForm(true)}
                    className="w-12 h-12 bg-agri-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-agri-red-100 text-white"
                >
                    <Plus className="w-6 h-6" />
                </motion.button>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-agri-red-50 rounded-2xl p-4 mb-5 border border-agri-red-100">
                <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-4 h-4 text-agri-red-500" />
                    <span className="text-xs font-bold text-agri-red-700 uppercase tracking-wider">Emergency Contacts</span>
                </div>
                <div className="flex gap-2">
                    {emergencyContacts.map((c, i) => (
                        <a key={i} href={`tel:${c.number.replace(/\D/g, '')}`}
                            className="flex-1 bg-white rounded-xl p-2.5 text-center shadow-sm border border-agri-red-50 active:scale-95 transition-transform"
                        >
                            <span className="text-lg block">{c.icon}</span>
                            <p className="text-[9px] font-bold text-gray-600 mt-1">{c.name}</p>
                            <p className="text-[10px] text-agri-red-500 font-bold">{c.number}</p>
                        </a>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-5">
                {[
                    { label: 'Total', value: logs.length, color: 'text-gray-800' },
                    { label: 'Critical', value: logs.filter(l => l.severity === 'Critical').length, color: 'text-red-500' },
                    { label: 'High', value: logs.filter(l => l.severity === 'High').length, color: 'text-orange-500' },
                    { label: 'This Month', value: logs.filter(l => new Date(l.timestamp).getMonth() === new Date().getMonth()).length, color: 'text-blue-500' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-2.5 text-center shadow-sm border border-gray-50">
                        <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Logs List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-agri-red-100 border-t-agri-red-500 rounded-full animate-spin" />
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-agri-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-10 h-10 text-agri-red-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No Incidents Logged</h3>
                    <p className="text-sm text-gray-400">Keep your farm safe. Log incidents when they happen.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {logs.map((log, idx) => {
                        const incidentType = getIncidentType(log.type);
                        const Icon = incidentType.icon;
                        return (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden"
                            >
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 ${incidentType.color} rounded-xl flex items-center justify-center`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{incidentType.label}</h4>
                                                <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide mt-0.5 ${severityColor(log.severity)}`}>
                                                    {log.severity}
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(log.id)} className="text-gray-300 hover:text-red-400">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{log.description}</p>
                                    {log.photos?.[0] && (
                                        <div className="w-full h-32 rounded-xl overflow-hidden mb-2">
                                            <img src={log.photos[0]} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(log.timestamp)}</span>
                                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{log.affectedCount} affected</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{log.lat?.toFixed(4)}, {log.lng?.toFixed(4)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Add Safety Log Form */}
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
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
                                <h2 className="text-xl font-black text-gray-900 mb-6">Report Incident</h2>

                                {/* GPS Tag */}
                                <div className="bg-agri-red-50 rounded-2xl p-3 mb-5 flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-agri-red-500" />
                                    <span className="text-xs text-agri-red-600 font-medium">
                                        GPS: {gpsLocation ? `${gpsLocation.latitude.toFixed(6)}, ${gpsLocation.longitude.toFixed(6)}` : 'Detecting...'}
                                    </span>
                                    <div className="ml-auto w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
                                </div>

                                {/* Incident Type */}
                                <div className="mb-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Incident Type</span>
                                    <div className="grid grid-cols-3 gap-2">
                                        {INCIDENT_TYPES.map(t => {
                                            const Icon = t.icon;
                                            return (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setForm(f => ({ ...f, type: t.id }))}
                                                    className={`p-3 rounded-xl text-center transition-all ${form.type === t.id
                                                        ? `${t.color} text-white shadow-md`
                                                        : 'bg-gray-50 text-gray-500 border border-gray-100'
                                                        }`}
                                                >
                                                    <Icon className="w-5 h-5 mx-auto mb-1" />
                                                    <span className="text-[9px] font-bold uppercase">{t.label.split(' ')[0]}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Severity */}
                                <div className="mb-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Severity</span>
                                    <div className="flex gap-2">
                                        {SEVERITY_LEVELS.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setForm(f => ({ ...f, severity: s }))}
                                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${form.severity === s
                                                    ? severityColor(s) + ' shadow-md'
                                                    : 'bg-gray-50 text-gray-400 border border-gray-100'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <label className="block mb-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Description *</span>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Describe what happened..."
                                        rows={3}
                                        className="w-full bg-gray-50 rounded-xl p-3 text-sm text-gray-800 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-agri-red-500 resize-none"
                                    />
                                </label>

                                {/* Affected Count */}
                                <label className="block mb-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Persons Affected</span>
                                    <input
                                        type="number"
                                        value={form.affectedCount}
                                        onChange={e => setForm(f => ({ ...f, affectedCount: parseInt(e.target.value) || 1 }))}
                                        min={1}
                                        className="w-full bg-gray-50 rounded-xl p-3 text-sm font-medium text-gray-800 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-agri-red-500"
                                    />
                                </label>

                                {/* Photo */}
                                <div className="mb-6">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Evidence Photo (Optional)</span>
                                    <div className="flex gap-3 flex-wrap">
                                        {form.photos.map((p, i) => (
                                            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-agri-red-200">
                                                <img src={p} alt="" className="w-full h-full object-cover" />
                                                <button onClick={() => setForm(f => ({ ...f, photos: f.photos.filter((_, j) => j !== i) }))}
                                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"><X className="w-3 h-3 text-white" /></button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400"
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
                                    disabled={saving || !form.description.trim()}
                                    className="w-full bg-agri-red-500 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-agri-red-100 disabled:opacity-30 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <AlertTriangle className="w-5 h-5" /> Submit Report
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

export default SafetyLogs;
