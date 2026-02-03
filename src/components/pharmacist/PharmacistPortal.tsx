import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ScanLine,
    Package,
    CheckCircle2,
    Clock,
    Lock,
    Unlock,
    ArrowRight,
    ShieldCheck,
    Smartphone,
    ChevronRight
} from 'lucide-react';
import QRScanner from '../common/QRScanner';
import type { Patient } from '../../types';

const PharmacistPortal: React.FC = () => {
    const { patients, dispensePrescription } = useAppContext();
    const [showScanner, setShowScanner] = useState(false);
    const [activePatient, setActivePatient] = useState<Patient | null>(null);
    const [requestPending, setRequestPending] = useState(false);

    const handleScan = (patientId: string) => {
        const p = patients.find(p => p.id === patientId);
        if (p) {
            setActivePatient(p);
            setShowScanner(false);
            setRequestPending(false);
        }
    };

    const handleDispense = (prescriptionId: string) => {
        if (!activePatient) return;
        dispensePrescription(activePatient.id, prescriptionId);

        setActivePatient({
            ...activePatient,
            prescriptions: activePatient.prescriptions.map(p =>
                p.id === prescriptionId ? { ...p, isDispensed: true } : p
            )
        });
    };

    const pendingPatients = patients.filter(p => p.prescriptions.some(rx => !rx.isDispensed));

    return (
        <div className="space-y-8 md:space-y-12 pb-24">
            {/* Context Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-peacock-50 text-peacock-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-peacock-100">
                        <Smartphone size={12} /> Biometric Validation Loop
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight italic">
                        Dispensing <br className="md:hidden" /> Terminal
                    </h2>
                </div>

                <button
                    onClick={() => setShowScanner(true)}
                    className="btn-primary !px-8 !py-6 !rounded-[2.5rem] text-xl md:text-2xl group shadow-2xl flex-shrink-0"
                >
                    <ScanLine size={32} className="group-hover:rotate-90 transition-transform duration-500 text-peacock-400" />
                    VALIDATE PATIENT NODE
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left: Triage/Pending List */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-black italic flex items-center gap-3">
                            <Clock className="text-peacock-500" /> Dispatch Queue
                        </h3>
                        <div className="px-3 py-1 bg-peacock-50 text-peacock-600 rounded-full text-[10px] font-black tracking-widest uppercase italic">{pendingPatients.length} Active</div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[600px] pr-2 no-scrollbar">
                        {pendingPatients.map((p, idx) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => {
                                    setActivePatient(p);
                                    setRequestPending(false);
                                }}
                                className={`card-premium !p-5 cursor-pointer transition-all rounded-3xl ${activePatient?.id === p.id ? 'border-peacock-500 bg-peacock-50/20 ring-4 ring-peacock-500/10' : 'hover:bg-white/80'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm p-1 border border-slate-100 flex-shrink-0">
                                        <img src={p.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-slate-900 leading-none mb-2 truncate uppercase italic">{p.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.id}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span className="text-[10px] font-black text-peacock-500 uppercase tracking-widest">
                                                {p.prescriptions.filter(rx => !rx.isDispensed).length} Pending
                                            </span>
                                        </div>
                                    </div>
                                    {p.isPharmacyAccessAllowed ? (
                                        <div className="text-emerald-500 bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100">
                                            <Unlock size={18} />
                                        </div>
                                    ) : (
                                        <div className="text-red-500 bg-red-50 p-2.5 rounded-2xl border border-red-100">
                                            <Lock size={18} />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Interaction Workspace */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {!activePatient ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="card-premium h-[600px] border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 rounded-[3rem]"
                            >
                                <div className="w-28 h-28 bg-white shadow-premium rounded-full flex items-center justify-center mb-10 text-slate-200">
                                    <Package size={56} className="opacity-20 translate-y-1" />
                                </div>
                                <h3 className="text-4xl font-black text-slate-300 mb-4 tracking-tighter italic">NO ACTIVE VALIDATION</h3>
                                <p className="text-slate-400 font-bold max-w-sm mx-auto uppercase text-xs tracking-[0.2em] leading-relaxed">
                                    Pending patient node validation. <br /> Scan QR to initialize dispensing loop.
                                </p>
                            </motion.div>
                        ) : !activePatient.isPharmacyAccessAllowed ? (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card-premium h-[600px] border-2 border-red-100 bg-red-50/30 flex flex-col items-center justify-center text-center p-12 rounded-[3.5rem]"
                            >
                                <div className="w-28 h-28 bg-red-600 text-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-red-900/40 relative">
                                    <div className="absolute inset-0 bg-red-600 animate-ping rounded-[2.5rem] opacity-20" />
                                    <Lock size={56} />
                                </div>
                                <h3 className="text-4xl font-black text-red-600 mb-4 uppercase tracking-tighter italic leading-none">Access Node <br /> Blocked</h3>
                                <p className="font-bold text-red-700/60 max-w-sm mb-12 uppercase text-xs tracking-widest leading-relaxed">
                                    The patient has revoked Medical Store Consent. Ask the patient to toggle 'Pharmacy Access' in their Sovereign Identity Node.
                                </p>
                                <button
                                    onClick={() => setRequestPending(true)}
                                    disabled={requestPending}
                                    className="bg-red-600 hover:bg-red-700 text-white font-black px-12 py-5 rounded-3xl shadow-2xl shadow-red-900/30 transition-all flex items-center gap-4 active:scale-95 disabled:opacity-50"
                                >
                                    {requestPending ? 'POLLING LEDGER...' : 'SEND ACCESS REQUEST'}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-10"
                            >
                                {/* Patient Header Inverted */}
                                <div className="card-premium clinical-gradient text-white !p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group border-none">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150" />

                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                        <div className="w-24 h-24 bg-white rounded-[2.5rem] p-1.5 shadow-2xl overflow-hidden group-hover:rotate-3 transition-transform">
                                            <img src={activePatient.avatar} alt="" className="w-full h-full object-cover rounded-[2rem]" />
                                        </div>
                                        <div className="text-center md:text-left">
                                            <p className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.4em] mb-2 leading-none">Authenticated Ledger Node</p>
                                            <h3 className="text-5xl font-black tracking-tighter italic leading-none">{activePatient.name}</h3>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                                                <span className="text-[10px] font-black px-4 py-1.5 bg-white/10 rounded-full uppercase tracking-wider border border-white/10">Blood: {activePatient.bloodGroup}</span>
                                                <span className="text-[10px] font-black px-4 py-1.5 bg-red-400/20 text-red-200 rounded-full uppercase tracking-wider border border-red-400/20">Allergies: {activePatient.allergies.length > 0 ? "YES" : "NONE"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative z-10 bg-white/10 border border-white/20 p-4 rounded-3xl backdrop-blur-md">
                                        <Unlock size={48} className="text-emerald-400" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-2xl font-black italic tracking-tighter px-2 flex items-center justify-between">
                                        <span>ACTIVE PRESCRIPTION LOOP</span>
                                        <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-4 py-1 rounded-full uppercase italic pr-6 h-fit">Verified</span>
                                    </h4>

                                    <div className="grid grid-cols-1 gap-6">
                                        {activePatient.prescriptions.filter(rx => !rx.isDispensed).length === 0 ? (
                                            <div className="card-premium !bg-emerald-50/30 border-dashed border-emerald-100 text-center py-24 rounded-[3rem]">
                                                <div className="w-20 h-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-900/20">
                                                    <CheckCircle2 size={40} />
                                                </div>
                                                <h5 className="text-2xl font-black text-emerald-900 italic tracking-tighter">LEDGER CLEARED</h5>
                                                <p className="text-emerald-700/60 font-black uppercase text-[10px] tracking-widest mt-2">All medications for this sequence have been dispensed.</p>
                                            </div>
                                        ) : (
                                            activePatient.prescriptions.map(rx => (
                                                <motion.div
                                                    key={rx.id}
                                                    whileHover={{ x: 10 }}
                                                    className={`card-premium flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all relative ${rx.isDispensed ? 'opacity-30 grayscale border-none' : 'hover:shadow-premium hover:border-peacock-500/50'}`}
                                                >
                                                    <div className="flex items-center gap-8">
                                                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-inner ${rx.isScribble ? 'bg-amber-50 text-amber-500' : 'bg-peacock-50 text-peacock-600'}`}>
                                                            <Package size={36} />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="text-[10px] font-black text-peacock-500 uppercase tracking-[0.2em]">{rx.id}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{rx.uploadedBy}</span>
                                                            </div>
                                                            <h5 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase truncate">{rx.title}</h5>
                                                            {rx.isScribble ? (
                                                                <div className="mt-4 flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl w-fit">
                                                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Encrypted Scribble Node Detected</span>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm font-semibold text-slate-500 leading-relaxed mt-3 italic bg-slate-50 border-l-4 border-peacock-100 p-3 rounded-r-2xl">
                                                                    "{rx.content}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {!rx.isDispensed ? (
                                                        <button
                                                            onClick={() => handleDispense(rx.id)}
                                                            className="bg-peacock-900 text-white font-black px-12 py-5 rounded-3xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl shadow-peacock-900/30 text-xl tracking-tighter"
                                                        >
                                                            DISPENSE <ChevronRight size={24} />
                                                        </button>
                                                    ) : (
                                                        <div className="text-emerald-600 flex items-center gap-3 font-black text-xl italic px-8">
                                                            <CheckCircle2 size={32} /> FULFILLED
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
        </div>
    );
};

export default PharmacistPortal;
