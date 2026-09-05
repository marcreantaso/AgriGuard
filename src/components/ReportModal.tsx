import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, Mail, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getRegions, getProvincesByRegion, getMunicipalitiesByProvince, getContactByMunicipality } from '../constants/lgu-contacts';
import emailjs from '@emailjs/browser';

// EmailJS Configuration - Replace with your own keys from emailjs.com
const EMAILJS_SERVICE_ID = 'service_agriguard';
const EMAILJS_TEMPLATE_ID = 'template_disease_report';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Get this from EmailJS dashboard

const ReportModal = ({ isOpen, onClose, scanResult }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        region: '',
        province: '',
        municipality: '',
        farmerName: '',
        farmLocation: '',
        additionalNotes: '',
        contactNumber: ''
    });

    const regions = getRegions();
    const provinces = formData.region ? getProvincesByRegion(formData.region) : [];
    const municipalities = formData.province ? getMunicipalitiesByProvince(formData.province) : [];
    const selectedContact = formData.municipality ? getContactByMunicipality(formData.municipality) : null;

    const handleChange = (field, value) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            // Reset dependent fields
            if (field === 'region') {
                updated.province = '';
                updated.municipality = '';
            } else if (field === 'province') {
                updated.municipality = '';
            }
            return updated;
        });
    };

    const sendReport = async () => {
        if (!selectedContact) return;

        setSending(true);
        setError(null);

        const templateParams = {
            to_email: selectedContact.email,
            to_name: selectedContact.contactPerson,
            from_name: formData.farmerName || 'AgriGuard User',
            disease_name: scanResult?.disease || 'Unknown Disease',
            crop_type: scanResult?.crop || 'Rice',
            confidence: scanResult?.confidence || 'N/A',
            status: scanResult?.status || 'unknown',
            farm_location: formData.farmLocation,
            municipality: formData.municipality,
            province: formData.province,
            region: formData.region,
            contact_number: formData.contactNumber,
            additional_notes: formData.additionalNotes,
            scan_date: new Date().toLocaleDateString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        try {
            // For demo purposes, we'll simulate the email send
            // In production, uncomment the emailjs.send line and comment out the simulation

            // await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);

            // Simulation for demo
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Email would be sent to:', selectedContact.email, templateParams);

            setSent(true);
        } catch (err) {
            console.error('Email send failed:', err);
            setError('Failed to send report. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        setSent(false);
        setError(null);
        setFormData({
            region: '',
            province: '',
            municipality: '',
            farmerName: '',
            farmLocation: '',
            additionalNotes: '',
            contactNumber: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
                onClick={resetAndClose}
            >
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-xl font-black text-gray-900">{t('report.title') || 'Report to LGU'}</h2>
                            <p className="text-xs text-gray-500">{t('report.subtitle') || 'Send disease alert to local authorities'}</p>
                        </div>
                        <button onClick={resetAndClose} className="p-2 rounded-xl bg-gray-100 text-gray-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Success State */}
                        {sent ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">{t('report.success_title') || 'Report Sent!'}</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    {t('report.success_message') || `Your disease report has been sent to ${selectedContact?.contactPerson} at ${selectedContact?.municipality}.`}
                                </p>
                                <button
                                    onClick={resetAndClose}
                                    className="px-8 py-3 bg-agri-green-500 text-white font-bold rounded-2xl"
                                >
                                    {t('common.done') || 'Done'}
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                {/* Disease Summary */}
                                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                            <AlertTriangle size={24} className="text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{t('report.disease_detected') || 'Disease Detected'}</p>
                                            <h3 className="text-lg font-black text-red-700">{scanResult?.disease || 'Unknown'}</h3>
                                            <p className="text-xs text-red-500">{scanResult?.crop} • {scanResult?.confidence}% confidence</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 1: Select LGU */}
                                {step === 1 && (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
                                            {t('report.select_lgu') || 'Select LGU Office'}
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">{t('report.region') || 'Region'}</label>
                                                <select
                                                    value={formData.region}
                                                    onChange={e => handleChange('region', e.target.value)}
                                                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium"
                                                >
                                                    <option value="">{t('report.select_region') || 'Select Region'}</option>
                                                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            </div>

                                            {formData.region && (
                                                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">{t('report.province') || 'Province'}</label>
                                                    <select
                                                        value={formData.province}
                                                        onChange={e => handleChange('province', e.target.value)}
                                                        className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium"
                                                    >
                                                        <option value="">{t('report.select_province') || 'Select Province'}</option>
                                                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                                                    </select>
                                                </motion.div>
                                            )}

                                            {formData.province && (
                                                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">{t('report.municipality') || 'Municipality/City'}</label>
                                                    <select
                                                        value={formData.municipality}
                                                        onChange={e => handleChange('municipality', e.target.value)}
                                                        className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium"
                                                    >
                                                        <option value="">{t('report.select_municipality') || 'Select Municipality'}</option>
                                                        {municipalities.map(m => <option key={m.municipality} value={m.municipality}>{m.municipality}</option>)}
                                                    </select>
                                                </motion.div>
                                            )}

                                            {selectedContact && (
                                                <motion.div
                                                    initial={{ y: 10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    className="bg-agri-green-50 border border-agri-green-100 rounded-2xl p-4"
                                                >
                                                    <div className="flex items-center gap-2 text-agri-green-600 mb-2">
                                                        <Mail size={16} />
                                                        <span className="text-xs font-black uppercase tracking-widest">{t('report.recipient') || 'Recipient'}</span>
                                                    </div>
                                                    <p className="font-bold text-gray-900">{selectedContact.contactPerson}</p>
                                                    <p className="text-sm text-gray-600">{selectedContact.email}</p>
                                                </motion.div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setStep(2)}
                                            disabled={!selectedContact}
                                            className="w-full mt-6 py-4 bg-agri-green-500 text-white font-black rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t('common.next') || 'Next'}
                                        </button>
                                    </motion.div>
                                )}

                                {/* Step 2: Farmer Details */}
                                {step === 2 && (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
                                            {t('report.your_details') || 'Your Details'}
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">{t('report.farmer_name') || 'Your Name'}</label>
                                                <input
                                                    type="text"
                                                    value={formData.farmerName}
                                                    onChange={e => handleChange('farmerName', e.target.value)}
                                                    placeholder="Juan Dela Cruz"
                                                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">{t('report.contact_number') || 'Contact Number'}</label>
                                                <input
                                                    type="tel"
                                                    value={formData.contactNumber}
                                                    onChange={e => handleChange('contactNumber', e.target.value)}
                                                    placeholder="09XX XXX XXXX"
                                                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">{t('report.farm_location') || 'Farm Location / Address'}</label>
                                                <input
                                                    type="text"
                                                    value={formData.farmLocation}
                                                    onChange={e => handleChange('farmLocation', e.target.value)}
                                                    placeholder="Barangay, Municipality"
                                                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">{t('report.additional_notes') || 'Additional Notes'}</label>
                                                <textarea
                                                    value={formData.additionalNotes}
                                                    onChange={e => handleChange('additionalNotes', e.target.value)}
                                                    placeholder="Describe the extent of infection, affected area size, etc."
                                                    rows={3}
                                                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium resize-none"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                                                {error}
                                            </div>
                                        )}

                                        <div className="flex gap-3 mt-6">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl"
                                            >
                                                {t('common.back') || 'Back'}
                                            </button>
                                            <button
                                                onClick={sendReport}
                                                disabled={sending || !formData.farmerName || !formData.farmLocation}
                                                className="flex-1 py-4 bg-agri-green-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {sending ? (
                                                    <>
                                                        <Loader2 size={18} className="animate-spin" />
                                                        {t('report.sending') || 'Sending...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send size={18} />
                                                        {t('report.send') || 'Send Report'}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReportModal;
