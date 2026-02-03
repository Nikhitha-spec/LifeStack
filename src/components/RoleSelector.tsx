import React from 'react';
import { motion } from 'framer-motion';
import { User, Activity, ShoppingBag, ShieldAlert, Settings, Heart } from 'lucide-react';
import type { Role } from '../types';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

// Roles moved inside component for translation support

const RoleSelector: React.FC = () => {
    const { setCurrentUser } = useAppContext();
    const { t } = useTranslation();
    const [selectedLang, setSelectedLang] = React.useState('English');

    const roles: { id: Role; name: string; icon: any; color: string; desc: string; accent: string }[] = [
        {
            id: 'patient',
            name: t('patientPortal'),
            icon: User,
            color: 'bg-clinical-500',
            accent: 'text-clinical-500',
            desc: 'Access your global health identity, QR node, and clinical history.'
        },
        {
            id: 'doctor',
            name: t('doctorTerminal'),
            icon: Activity,
            color: 'bg-indigo-500',
            accent: 'text-indigo-500',
            desc: 'Manage clinical triage, patient history, and scribble digital prescriptions.'
        },
        {
            id: 'pharmacist',
            name: t('pharmacistPortal'),
            icon: ShoppingBag,
            color: 'bg-blue-600',
            accent: 'text-blue-600',
            desc: 'Validate patient identity nodes and dispense prescribed medications.'
        },
        {
            id: 'admin',
            name: t('adminHub'),
            icon: Settings,
            color: 'bg-slate-700',
            accent: 'text-slate-700',
            desc: 'Onboard new patients and manage clinical dispatch systems.'
        },
        {
            id: 'emergency',
            name: t('emergencyPortal'),
            icon: ShieldAlert,
            color: 'bg-red-600',
            accent: 'text-red-600',
            desc: 'Bypass sovereign safeguards for life-critical medical interventions.'
        },
    ];

    const handleSelect = (role: Role) => {
        const names: Record<Role, string> = {
            patient: 'Alice Johnson',
            doctor: 'Dr. Sarah Lee',
            pharmacist: 'Pharm. Mike Ross',
            admin: 'Admin Hub',
            emergency: 'Response Unit Delta'
        };

        setCurrentUser({
            role,
            name: names[role],
            license: role === 'doctor' ? 'L-99231' : undefined,
            preferredLanguage: selectedLang
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-clinical-100/50 rounded-full blur-[120px] -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] -ml-64 -mb-64" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 text-center mb-12 max-w-2xl"
            >
                <div className="flex items-center justify-center gap-4 mb-4">
                    <Heart size={48} className="text-clinical-500 stroke-[1.5]" />
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                        {t('welcome')}<span className="text-clinical-500">{t('stack')}</span>
                    </h1>
                </div>

                {/* Language Picker for Rural Users */}
                <div className="flex flex-col items-center gap-4 mt-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('selectLang')}</p>
                    <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
                        {['English', 'Telugu', 'Hindi'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => {
                                    setSelectedLang(lang);
                                    document.body.className = `lang-${lang.toLowerCase()}`;
                                }}
                                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${selectedLang === lang
                                    ? 'bg-white text-clinical-600 shadow-lg scale-105'
                                    : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {lang === 'Telugu' ? 'తెలుగు' : lang === 'Hindi' ? 'हिन्दी' : lang}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl w-full">
                {roles.map((role, index) => (
                    <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5, ease: "circOut" }}
                        onClick={() => handleSelect(role.id)}
                        className="group relative cursor-pointer"
                    >
                        <div className={`absolute -inset-1 ${role.color} opacity-0 group-hover:opacity-10 rounded-[2.5rem] transition-opacity blur-xl`} />

                        <div className="card-premium h-full hover:border-clinical-200 transform group-hover:-translate-y-2 group-active:scale-95 duration-500 flex flex-col items-center justify-center text-center overflow-hidden bg-white/90 backdrop-blur-md border border-slate-100 py-12">
                            <div className={`w-20 h-20 ${role.color} rounded-3xl flex items-center justify-center mb-6 text-white shadow-xl shadow-blue-900/10 group-hover:scale-110 transition-all duration-500`}>
                                <role.icon size={36} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{role.name}</h3>

                            <div className={`absolute bottom-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${role.accent}`}>{t('accessPortal')}</span>
                                <Activity size={14} className={role.accent} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <footer className="relative z-10 mt-20 text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">
                {t('encryptionNotice')}
            </footer>
        </div>
    );
};

export default RoleSelector;
