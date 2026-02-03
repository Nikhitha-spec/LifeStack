import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    ScanLine,
    Clock,
    PenTool,
    Stethoscope,
    History,
    ChevronRight,
    User as UserIcon,
    ShieldAlert,
    ArrowRight,
    LayoutGrid
} from 'lucide-react';
import QRScanner from '../common/QRScanner';
import ScribblePad from '../common/ScribblePad';
import PatientCard from '../common/PatientCard';
import type { Patient, Prescription } from '../../types';

const DoctorDashboard: React.FC = () => {
    const { sessions, patients, currentUser, updateSession, updatePatient } = useAppContext();
    const { t } = useTranslation();
    const [showScanner, setShowScanner] = useState(false);
    const [activePatient, setActivePatient] = useState<Patient | null>(null);
    const [showScribble, setShowScribble] = useState(false);

    const specialization = currentUser?.name.includes('Sarah Lee') ? 'CARDIOLOGY' :
        currentUser?.name.includes('Robert Smith') ? 'DERMATOLOGY' : 'GENERAL PRACTICE';

    const doctorSessions = sessions.filter(s => s.doctorName === currentUser?.name && s.status === 'Waiting');

    const handleScan = (patientId: string) => {
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
            setActivePatient(patient);
            setShowScanner(false);
        } else {
            alert("Node validation failed: Invalid Patient Node");
        }
    };

    const handleSaveScribble = (base64: string) => {
        if (!activePatient) return;

        const newPrescription: Prescription = {
            id: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
            title: "Clinical Impression Node",
            content: base64,
            isScribble: true,
            isDispensed: false,
            uploadedBy: currentUser?.name || "Dr. Anonymous",
            doctorLicense: currentUser?.license || "L-00000",
            timestamp: new Date().toISOString()
        };

        updatePatient({
            ...activePatient,
            prescriptions: [newPrescription, ...activePatient.prescriptions]
        });

        const session = sessions.find(s => s.patientId === activePatient.id && s.doctorName === currentUser?.name);
        if (session) {
            updateSession(session.id, 'Completed');
        }

        setShowScribble(false);
        setActivePatient(null);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Clinical Stats - Grid for Mobile/Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 clinical-gradient card-premium !p-8 text-white relative overflow-hidden group">
                    <Stethoscope size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                    <div className="relative z-10">
                        <p className="text-peacock-300 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Clinic Terminal</p>
                        <h2 className="text-3xl font-black tracking-tight">{specialization}</h2>
                        <div className="mt-8 flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full text-[10px] font-black border border-white/20 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Secure Node Linked
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 card-premium flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-peacock-50 text-peacock-600 rounded-3xl flex items-center justify-center mb-4">
                        <Users size={32} />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-slate-900 leading-none mb-1">{doctorSessions.length}</h3>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{t('triageQueue')}</p>
                    </div>
                </div>

                <div className="md:col-span-5 h-full">
                    <button
                        onClick={() => setShowScanner(true)}
                        className="w-full h-full btn-primary !rounded-4xl text-2xl group flex flex-col md:flex-row items-center gap-6 p-10"
                    >
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                            <ScanLine size={32} />
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-[10px] font-black tracking-[0.3em] opacity-60 mb-1">SESSION START</div>
                            {t('validatePatient')}
                        </div>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Responsive Queue - Accordion style on mobile, list on desktop */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-black flex items-center gap-3 italic">
                            <Clock className="text-peacock-500" /> {t('clinicalQueue')}
                        </h3>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 tracking-widest uppercase italic">Real-Time</div>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 no-scrollbar">
                        {doctorSessions.length > 0 ? (
                            doctorSessions.map((session, idx) => {
                                const p = patients.find(p => p.id === session.patientId);
                                return (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`card-premium !p-5 cursor-pointer ring-peacock-500/20 group transition-all rounded-3xl ${activePatient?.id === p?.id ? 'border-peacock-500 bg-peacock-50/20 ring-4' : 'hover:bg-white/80'}`}
                                        onClick={() => setActivePatient(p || null)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm p-1 border border-slate-100 flex-shrink-0">
                                                <img
                                                    src={p?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.patientId}`}
                                                    className="w-full h-full rounded-xl object-cover"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-slate-900 leading-none mb-2 truncate group-hover:text-peacock-600 transition-colors uppercase italic">{p?.name || 'Anonymous Node'}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.patientId}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Wait: 12min</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} className="text-slate-300 group-hover:text-peacock-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="card-premium !bg-transparent border-dashed border-2 border-slate-200 flex flex-col items-center justify-center p-20 text-slate-400">
                                <Users size={48} className="mb-4 opacity-10" />
                                <p className="font-black uppercase tracking-[0.2em] text-[10px]">Queue Dispersed</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Workspace area */}
                <div className="lg:col-span-8 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activePatient ? (
                            <motion.div
                                key="workspace"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between px-2">
                                    <div>
                                        <h3 className="text-3xl font-black italic tracking-tighter">{t('clinicalWorkspace')}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Interaction Loop</p>
                                    </div>
                                    <button
                                        onClick={() => setActivePatient(null)}
                                        className="text-slate-400 hover:text-red-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors"
                                    >
                                        Drop Session
                                    </button>
                                </div>

                                <PatientCard patient={activePatient} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="card-premium h-full flex flex-col space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xl font-black flex items-center gap-3">
                                                <History className="text-peacock-500" /> Sovereign Ledger
                                            </h4>
                                            <span className="text-[10px] font-black text-slate-400 uppercase">{activePatient.prescriptions.length} Records</span>
                                        </div>

                                        <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 no-scrollbar flex-1">
                                            {activePatient.prescriptions.map(rx => (
                                                <div key={rx.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:border-peacock-100 transition-colors">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="font-black text-slate-900 tracking-tight flex items-center gap-2"><ArrowRight size={14} className="text-peacock-500" /> {rx.title}</span>
                                                        <span className="text-[9px] font-black bg-white border border-slate-200 px-2 py-1 rounded-full text-slate-500 uppercase italic">{new Date(rx.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                    {!rx.isScribble ? (
                                                        <p className="text-sm text-slate-600 font-semibold leading-relaxed italic opacity-80">"{rx.content}"</p>
                                                    ) : (
                                                        <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl flex items-center gap-2 tracking-widest uppercase">
                                                            <PenTool size={14} /> Encrypted Digital Scribble Node
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-rows-2 gap-8 h-full">
                                        <button
                                            onClick={() => setShowScribble(true)}
                                            className="card-premium group hover:border-peacock-500 flex flex-col justify-center items-center gap-6 relative overflow-hidden h-full"
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-peacock-500/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000" />
                                            <div className="w-20 h-20 bg-peacock-50 text-peacock-600 rounded-3xl flex items-center justify-center group-hover:bg-peacock-600 group-hover:text-white transition-all duration-500 shadow-lg">
                                                <PenTool size={40} />
                                            </div>
                                            <div className="text-center relative z-10">
                                                <h5 className="text-2xl font-black mb-1">MINT SCRIBBLE</h5>
                                                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">Digital Handprinting</p>
                                            </div>
                                        </button>

                                        <button className="card-premium group hover:border-indigo-500 flex flex-col justify-center items-center gap-6 relative overflow-hidden h-full opacity-50 cursor-not-allowed">
                                            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                                                <LayoutGrid size={40} />
                                            </div>
                                            <div className="text-center">
                                                <h5 className="text-2xl font-black mb-1">LOOP SUMMARY</h5>
                                                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">Advanced Analytics</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="card-premium h-[600px] flex flex-col items-center justify-center text-center p-12 md:p-24 border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-[3rem]"
                            >
                                <div className="w-28 h-28 bg-white shadow-premium rounded-full flex items-center justify-center text-slate-200 mb-10 relative">
                                    <div className="absolute inset-0 bg-peacock-500/5 animate-ping rounded-full" />
                                    <UserIcon size={56} className="relative z-10" />
                                </div>
                                <h3 className="text-4xl font-black text-slate-300 mb-4 tracking-tighter leading-none italic">IDLE WORKSPACE</h3>
                                <p className="text-slate-400 font-bold max-w-sm mx-auto uppercase text-xs tracking-[0.2em] leading-relaxed mb-10">
                                    Validate a Patient Node to initialize <br /> a clinical clinical interaction loop.
                                </p>
                                <div className="flex items-center gap-3 text-peacock-500 bg-white border border-peacock-100 px-6 py-3 rounded-full font-black text-[10px] tracking-[0.3em] shadow-sm uppercase italic">
                                    <ShieldAlert size={14} className="animate-pulse" /> End-to-End Secure Session
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modals */}
            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
            {showScribble && <ScribblePad onSave={handleSaveScribble} onClose={() => setShowScribble(false)} />}
        </div>
    );
};

export default DoctorDashboard;
