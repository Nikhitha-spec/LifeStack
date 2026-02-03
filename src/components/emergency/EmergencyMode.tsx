import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import PatientCard from '../common/PatientCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert,
    Clock,
    Unlock,
    AlertCircle,
    Activity,
    ScanLine,
    Zap,
    ChevronRight,
    ShieldCheck,
    Smartphone
} from 'lucide-react';
import QRScanner from '../common/QRScanner';
import type { Patient } from '../../types';

const EmergencyMode: React.FC = () => {
    const { patients } = useAppContext();
    const [activePatient, setActivePatient] = useState<Patient | null>(null);
    const [showScanner, setShowScanner] = useState(false);
    const [isJustified, setIsJustified] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes session
    const [justification, setJustification] = useState('');

    useEffect(() => {
        let timer: any;
        if (activePatient && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setActivePatient(null);
            setTimeLeft(300);
            setIsJustified(false);
        }
        return () => clearInterval(timer);
    }, [activePatient, timeLeft]);

    const handleScan = (patientId: string) => {
        const p = patients.find(p => p.id === patientId);
        if (p) {
            setActivePatient(p);
            setShowScanner(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-10 md:space-y-12 pb-24 max-w-7xl mx-auto">
            {/* High Alert Header */}
            <div className={`p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden transition-colors duration-700 ${activePatient ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] -mr-96 -mt-96" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 border border-white/20">
                            <ShieldAlert size={16} className="text-red-400 animate-pulse" /> System v4.0 Critical
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-none mb-6">ER RESPONDER <br /> TERMINAL</h2>
                        <p className="text-white/60 font-bold text-lg max-w-xl uppercase tracking-widest leading-relaxed">
                            Bypass all sovereign privacy layers for immediate life-saving medical intervention.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        {!activePatient ? (
                            <button
                                onClick={() => setShowScanner(true)}
                                className="bg-red-600 hover:bg-red-500 text-white p-12 rounded-[3rem] shadow-2xl shadow-red-900/50 transition-all active:scale-95 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 animate-ping rounded-full opacity-20" />
                                <ScanLine size={64} className="group-hover:rotate-90 transition-transform duration-700" />
                                <div className="mt-4 font-black text-xs uppercase tracking-[0.4em]">Initialize Scan</div>
                            </button>
                        ) : (
                            <div className="bg-white text-red-600 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center text-center ring-8 ring-white/10">
                                <Clock size={48} className="mb-2" />
                                <div className="text-5xl font-black font-mono tracking-tighter leading-none mb-2">{formatTime(timeLeft)}</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Session Expiry</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activePatient ? (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
                    >
                        {/* Access Bypass Status */}
                        <div className="lg:col-span-8 space-y-10">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-3xl font-black italic tracking-tighter flex items-center gap-4">
                                    <Unlock size={36} className="text-red-600" /> BYPASS ACTIVE
                                </h3>
                                <div className="px-5 py-2 bg-red-50 text-red-600 rounded-full text-xs font-black tracking-widest uppercase italic border border-red-100">Full Access Loop</div>
                            </div>

                            <PatientCard patient={activePatient} />

                            {/* Critical Access Vitals */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'HEART RATE', value: '112 BPM', icon: Activity, color: 'text-red-500' },
                                    { label: 'SPO2', value: '94%', icon: Zap, color: 'text-amber-500' },
                                    { label: 'BLOOD TYPE', value: activePatient.bloodGroup, icon: ShieldAlert, color: 'text-red-600' },
                                    { label: 'ALLERGIES', value: activePatient.allergies.length || 'NONE', icon: AlertCircle, color: 'text-orange-600' },
                                ].map((stat, i) => (
                                    <div key={i} className="card-premium h-full flex flex-col justify-center border-none bg-white shadow-xl">
                                        <stat.icon size={20} className={`${stat.color} mb-3`} />
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                                        <div className="text-2xl font-black text-slate-900 italic uppercase">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Justification sidebar */}
                        <div className="lg:col-span-4 h-full">
                            <div className="card-premium h-full bg-slate-900 text-white border-none p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mb-32" />

                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <ShieldAlert size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight uppercase italic leading-none">Justification</h3>
                                            <p className="text-red-400 font-bold uppercase text-[10px] tracking-widest mt-2">Legal Ledger Log</p>
                                        </div>
                                    </div>

                                    {!isJustified ? (
                                        <div className="space-y-6">
                                            <p className="text-sm font-semibold text-slate-400 leading-relaxed italic border-l-2 border-red-600 pl-4 py-2">
                                                By overriding this node's privacy layers, you certify that this is a life-critical emergency.
                                            </p>
                                            <textarea
                                                className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 font-bold text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm no-scrollbar"
                                                placeholder="Enter reason for override (e.g. Unresponsive Patient, Cardiac Arrest)..."
                                                value={justification}
                                                onChange={(e) => setJustification(e.target.value)}
                                            />
                                            <button
                                                onClick={() => setIsJustified(true)}
                                                disabled={justification.length < 10}
                                                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded-3xl shadow-xl shadow-red-900/50 flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale uppercase tracking-widest text-sm"
                                            >
                                                LOG JUSTIFICATION & SAVE <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-12 bg-white/5 rounded-[2.5rem] border border-white/10"
                                        >
                                            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-900/40">
                                                <ShieldCheck size={40} />
                                            </div>
                                            <h4 className="text-xl font-black uppercase tracking-tight mb-2 italic">LOGGED TO LEDGER</h4>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-8">Transaction ID: LS-ER-{Date.now().toString().slice(-6)}</p>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="mt-12 text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] relative z-10">
                                    GOVERNMENT AUDIT LOG ACTIVE
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="card-premium h-[600px] border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-[4rem] flex flex-col items-center justify-center text-center p-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                        <div className="w-32 h-32 bg-white shadow-premium rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-10 group-hover:scale-110 transition-transform">
                            <Smartphone size={64} className="opacity-10" />
                        </div>
                        <h3 className="text-4xl font-black text-slate-400 mb-4 italic tracking-tighter leading-none">NO ACTIVE SEQUENCE</h3>
                        <p className="text-slate-500/60 font-black uppercase text-xs tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                            Scan a Patient node to bypass <br /> access and access vitals immediately.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
        </div>
    );
};

export default EmergencyMode;
