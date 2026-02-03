import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from '../../hooks/useTranslation';
import { motion } from 'framer-motion';
import {
    Zap,
    Shield,
    Info,
    Calendar,
    User,
    Weight,
    Ruler,
    Stethoscope,
    BadgeAlert
} from 'lucide-react';
import type { Patient } from '../../types';

interface PatientCardProps {
    patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const { t } = useTranslation();

    return (
        <div
            id="patient-id-card"
            className="relative w-full aspect-[1.58/1] max-w-3xl perspective-1000 cursor-pointer group mx-auto h-[400px] md:h-[450px]"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
                className="relative w-full h-full preserve-3d shadow-2xl rounded-[3rem]"
            >
                {/* Front Side: Clinical Identity Node (White with Red Accents) */}
                <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-100 rounded-[3rem] p-8 md:p-10 text-slate-900 flex flex-col justify-between overflow-hidden shadow-2xl ring-1 ring-slate-200">
                    {/* Security Watermark */}
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <Shield size={300} className="rotate-12" />
                    </div>

                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex gap-6 items-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-[2.5rem] p-1 shadow-inner overflow-hidden ring-4 ring-red-50"
                            >
                                <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover rounded-[2rem]" />
                            </motion.div>
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-[9px] font-black text-red-600 uppercase tracking-[0.2em] mb-3">
                                    <Shield size={10} /> SECURE CLINICAL IDENTITY
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none text-slate-900">{patient.name}</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{t('nodeId')}: <span className="text-red-500 font-black">{patient.id}</span></p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-[2rem] shadow-xl border border-slate-50 hidden sm:block">
                            <QRCodeSVG
                                value={patient.id}
                                size={90}
                                level="H"
                                fgColor="#ef4444"
                                includeMargin={false}
                            />
                        </div>
                    </div>

                    {/* Detailed Info Grid */}
                    <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        {[
                            { label: t('dob'), value: patient.dob, icon: Calendar },
                            { label: t('gender'), value: patient.gender, icon: User },
                            { label: t('weight'), value: patient.weight, icon: Weight },
                            { label: t('height'), value: patient.height, icon: Ruler }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 group-hover:bg-red-50/30 transition-colors">
                                <item.icon className="text-red-500 mb-2" size={16} />
                                <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-0.5">{item.label}</p>
                                <p className="text-sm font-black text-slate-800">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Live Biometric Feed Synchronized</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-end">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('medicalSignature')}</p>
                                <p className="text-xs font-black italic text-red-600">CERTIFIED-X9</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side: Detailed Medical History (White with Red Details) */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-[3rem] p-8 md:p-12 text-slate-900 flex flex-col justify-between [transform:rotateY(180deg)] border-2 border-red-100 shadow-2xl">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
                                    <BadgeAlert size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Clinical Ledger</h2>
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">Sovereign Data Loop</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase">Blood Group</p>
                                <p className="text-xl font-black text-red-600">{patient.bloodGroup}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap size={14} className="text-red-500" /> Critical Warnings
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {patient.allergies.map(all => (
                                        <span key={all} className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {all}
                                        </span>
                                    ))}
                                    {patient.allergies.length === 0 && <span className="text-slate-400 text-xs font-bold italic">No known drug reactive nodes</span>}
                                </div>
                            </div>

                            <div className="space-y-4 flex flex-col">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Stethoscope size={14} className="text-red-500" /> Care Provider
                                </p>
                                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                    <p className="text-xs font-black text-slate-800 italic uppercase mb-1">{patient.primaryPhysician}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Primary Handling MD</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Info size={14} className="text-red-500" /> Insurance & Coverage
                            </p>
                            <div className="bg-red-50/30 p-4 rounded-3xl border border-red-100/50 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-slate-900 mb-0.5">{patient.insuranceId}</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Payer Node</p>
                                </div>
                                <Shield size={20} className="text-red-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center justify-center italic text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        This digital node is protected by sovereign encryption standards.
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PatientCard;
