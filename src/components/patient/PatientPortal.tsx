import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import PatientCard from '../common/PatientCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    ShieldAlert,
    History,
    Volume2,
    FileText,
    MessageSquare,
    ChevronRight,
    Sparkles,
    Globe,
    Activity,
    QrCode
} from 'lucide-react';
import { decodeMedicalReport } from '../../services/geminiService';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { Download } from 'lucide-react';

const PatientPortal: React.FC = () => {
    const { patients, updatePatient, currentUser } = useAppContext();
    const { t } = useTranslation();
    const patient = patients.find(p => p.name === "Alice Johnson") || patients[0];
    const [isDecoding, setIsDecoding] = useState(false);
    const [decodedContent, setDecodedContent] = useState<string | null>(null);
    const [targetLang, setTargetLang] = useState(currentUser?.preferredLanguage || 'English');
    const [isDownloading, setIsDownloading] = useState(false);

    const handleToggleConsent = () => {
        updatePatient({
            ...patient,
            isPharmacyAccessAllowed: !patient.isPharmacyAccessAllowed
        });
    };

    const handleDecode = async (content: string) => {
        setIsDecoding(true);
        const result = await decodeMedicalReport(content, targetLang);
        setDecodedContent(result);
        setIsDecoding(false);
    };

    const handleDownloadID = async () => {
        const node = document.getElementById('patient-id-card');
        if (node) {
            setIsDownloading(true);
            try {
                // Ensure the animation is finished or wait a bit
                const dataUrl = await toPng(node, {
                    cacheBust: true,
                    backgroundColor: '#ffffff',
                    style: {
                        borderRadius: '3rem'
                    }
                });
                download(dataUrl, `${patient.name}-LifeStack-ID.png`);
            } catch (err) {
                console.error('Download failed', err);
                alert("Clinical Export Failed: Sequence Interrupted");
            } finally {
                setIsDownloading(false);
            }
        }
    };

    return (
        <div className="space-y-8 md:space-y-12">
            {/* Action Bar / Hero */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
                        <Activity size={12} /> {t('activeSystem')}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight italic">
                        {t('digitalIdentity')}
                    </h2>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrolling-touch no-scrollbar">
                    <button className="flex-shrink-0 btn-primary !py-3 !px-6 text-sm">
                        <QrCode size={18} /> SHARING NODE
                    </button>
                    <button
                        onClick={handleDownloadID}
                        disabled={isDownloading}
                        className="flex-shrink-0 btn-secondary !py-3 !px-6 text-sm flex items-center gap-2"
                    >
                        {isDownloading ? (
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Download size={18} />
                        )}
                        {isDownloading ? 'EXPORTING...' : 'DOWNLOAD ID'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ID Card section */}
                <div className="lg:col-span-8">
                    <PatientCard patient={patient} />

                    {/* ID Context Bar */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'STATUS', value: 'VERIFIED', icon: ShieldCheck, color: 'text-emerald-500' },
                            { label: 'LAST SCAN', value: '2H AGO', icon: History, color: 'text-slate-400' },
                            { label: 'LANGUAGE', value: currentUser?.preferredLanguage?.toUpperCase() || 'ENGLISH', icon: Globe, color: 'text-peacock-500' },
                            { label: 'UPTIME', value: '99.9%', icon: Activity, color: 'text-indigo-500' },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 bg-white rounded-3xl border border-slate-100 border-b-2 border-b-peacock-500/20">
                                <stat.icon size={16} className={`${stat.color} mb-2`} />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-sm font-black text-slate-900">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Consent sidebar */}
                <div className="lg:col-span-4 h-full">
                    <div className="card-premium h-full border-none bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl ${patient.isPharmacyAccessAllowed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'} shadow-lg`}>
                                    {patient.isPharmacyAccessAllowed ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-slate-900">{t('pharmacyAccess')}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('dataSovereignty')}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm font-semibold text-slate-600 leading-relaxed italic border-l-2 border-peacock-100 pl-4 py-1">
                                    "When active, hospitals and stores can access your verified prescriptions via biometric QR validation."
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 space-y-4">
                            <button
                                onClick={handleToggleConsent}
                                className={`w-full py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-between px-8 shadow-2xl group ${patient.isPharmacyAccessAllowed
                                    ? 'bg-peacock-900 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                    }`}
                            >
                                <span className="tracking-tight">{patient.isPharmacyAccessAllowed ? 'ACCESS: ON' : 'ACCESS: OFF'}</span>
                                <div className={`w-12 h-6 rounded-full relative transition-colors ${patient.isPharmacyAccessAllowed ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                                    <motion.div
                                        animate={{ x: patient.isPharmacyAccessAllowed ? 28 : 4 }}
                                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md shadow-black/20"
                                    />
                                </div>
                            </button>
                            <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-[0.3em]">Identity Hub Protection Enabled</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI & History Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Decoder */}
                <div className="card-premium bg-peacock-900 text-white border-none overflow-hidden relative group">
                    <Sparkles size={200} className="absolute -right-20 -top-20 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />

                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                <Globe size={28} className="text-peacock-200" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">Gemini AI Decoder</h3>
                                <p className="text-peacock-300 font-bold uppercase text-[10px] tracking-widest">Natural Language Processing</p>
                            </div>
                        </div>

                        <p className="text-peacock-50 font-medium text-sm leading-relaxed max-w-md">
                            Decode complex clinical jargon into layman terms across 4 global languages.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <select
                                value={targetLang}
                                onChange={(e) => setTargetLang(e.target.value)}
                                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 px-6 font-black text-sm outline-none focus:ring-2 focus:ring-peacock-400"
                            >
                                <option className="bg-peacock-900">English</option>
                                <option className="bg-peacock-900">Telugu</option>
                                <option className="bg-peacock-900">Hindi</option>
                                <option className="bg-peacock-900">Spanish</option>
                                <option className="bg-peacock-900">French</option>
                            </select>
                            <button
                                onClick={() => handleDecode(patient.prescriptions[0]?.content || "No record available")}
                                disabled={isDecoding || !patient.prescriptions.length}
                                className="bg-emerald-500 hover:bg-emerald-400 text-peacock-900 font-black py-4 px-8 rounded-2xl flex-1 flex items-center justify-center gap-3 transition-active active:scale-95 disabled:opacity-50 shadow-xl shadow-emerald-900/40"
                            >
                                {isDecoding ? (
                                    <div className="w-5 h-5 border-3 border-peacock-900 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <><Sparkles size={18} /> {t('decodeReport')}</>
                                )}
                            </button>
                        </div>

                        <AnimatePresence>
                            {decodedContent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-emerald-400 font-black uppercase text-[10px] tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full">{t('aiInsight')}</span>
                                        <button
                                            onClick={() => {
                                                const s = window.speechSynthesis;
                                                s.speak(new SpeechSynthesisUtterance(decodedContent));
                                            }}
                                            className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                                        >
                                            <Volume2 size={20} />
                                        </button>
                                    </div>
                                    <p className="text-peacock-50 leading-relaxed font-semibold italic text-sm">"{decodedContent}"</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Digital Archive */}
                <div className="card-premium space-y-8 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                                <History size={24} />
                            </div>
                            <h3 className="text-2xl font-black">{t('digitalArchive')}</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-black text-peacock-500">{patient.prescriptions.length}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                        </div>
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-2 max-h-[460px] scrolling-touch no-scrollbar flex-1">
                        {patient.prescriptions.length > 0 ? (
                            patient.prescriptions.map((rx) => (
                                <motion.div
                                    key={rx.id}
                                    className="group flex items-center gap-4 p-4 rounded-3xl hover:bg-peacock-50 border border-transparent hover:border-peacock-100 transition-all cursor-pointer"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${rx.isScribble ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} group-hover:rotate-12 transition-transform`}>
                                        {rx.isScribble ? <FileText size={24} /> : <MessageSquare size={24} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-slate-900 truncate tracking-tight">{rx.title}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{rx.uploadedBy} • {new Date(rx.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${rx.isDispensed ? 'bg-slate-100 text-slate-400' : 'bg-emerald-500 text-white'}`}>
                                            {rx.isDispensed ? 'CLOSED' : 'ACTIVE'}
                                        </span>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-peacock-500" />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
                                <FileText size={48} className="opacity-20 mb-4" />
                                <p className="font-black uppercase tracking-[0.2em] text-[10px]">No ledger entries found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientPortal;
