import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import {
    UserPlus,
    Users,
    Settings,
    Plus,
    Search,
    LayoutGrid,
    ChevronRight,
    Filter
} from 'lucide-react';
import type { Patient } from '../../types';

const AdminHub: React.FC = () => {
    const { patients, addPatient, addSession } = useAppContext();
    const [name, setName] = useState('');
    const [bloodGroup, setBloodGroup] = useState('O+');
    const [searchTerm, setSearchTerm] = useState('');

    const handleEnroll = (e: React.FormEvent) => {
        e.preventDefault();
        const newPatient: Patient = {
            id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
            name,
            dob: '1990-01-01',
            gender: 'UNSPECIFIED',
            weight: '70kg',
            height: '175cm',
            bloodGroup,
            allergies: [],
            chronicConditions: [],
            isPharmacyAccessAllowed: true,
            prescriptions: [],
            primaryPhysician: 'Dr. Sarah Lee',
            insuranceId: `INS-${Math.floor(100000 + Math.random() * 900000)}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };
        addPatient(newPatient);
        setName('');
    };

    const handleDispatch = (patientId: string) => {
        const session = {
            id: `S-${Date.now()}`,
            patientId,
            doctorName: 'Dr. Sarah Lee', // Default for demo
            status: 'Waiting' as const,
            timestamp: new Date().toISOString()
        };
        addSession(session);
        alert(`Patient ${patientId} dispatched to Cardiology Terminal`);
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-24">
            {/* Clinical Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-peacock-50 text-peacock-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-peacock-100">
                        <Settings size={12} /> Management Node v4
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight italic">
                        Registry & <br className="md:hidden" /> Management Hub
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="card-premium h-full flex flex-col justify-center px-8 border-none bg-white/80">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Global Active</div>
                        <div className="text-3xl font-black text-slate-900">{patients.length} Nodes</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Registration Form */}
                <div className="lg:col-span-4">
                    <div className="card-premium h-full bg-peacock-900 text-white relative overflow-hidden group border-none shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-peacock-900 shadow-xl group-hover:rotate-12 transition-transform duration-500">
                                    <UserPlus size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight italic uppercase">Enroll New Patient</h3>
                                    <p className="text-peacock-300 font-bold uppercase text-[10px] tracking-widest">Generate Identity Node</p>
                                </div>
                            </div>

                            <form onSubmit={handleEnroll} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-peacock-300 ml-4">Full Name Entry</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Alice Johnson..."
                                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-5 px-6 font-black text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-peacock-400 transition-all text-lg"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-peacock-300 ml-4">Blood Group Node</label>
                                    <select
                                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-5 px-6 font-black text-white outline-none focus:ring-2 focus:ring-peacock-400 appearance-none text-lg"
                                        value={bloodGroup}
                                        onChange={(e) => setBloodGroup(e.target.value)}
                                    >
                                        <option className="bg-peacock-900">O+</option>
                                        <option className="bg-peacock-900">A+</option>
                                        <option className="bg-peacock-900">B+</option>
                                        <option className="bg-peacock-900">AB+</option>
                                        <option className="bg-peacock-900">O-</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-peacock-900 font-black py-6 rounded-3xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl shadow-emerald-900/30 text-xl tracking-tighter mt-12"
                                >
                                    CREATE IDENTITY NODE <Plus size={24} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Registry Management */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="card-premium flex flex-col h-full space-y-8 bg-white/80 border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <h3 className="text-3xl font-black italic tracking-tighter flex items-center gap-4">
                                <Users size={36} className="text-peacock-500" /> Identity LedgerHub
                            </h3>

                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by ID or Name..."
                                    className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-14 pr-6 font-bold text-slate-900 focus:ring-2 focus:ring-peacock-500/20 outline-none placeholder:text-slate-400 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <button className="hidden md:flex items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-100 transition-colors">
                                <Filter size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-x-auto no-scrollbar">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="text-left py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Patient Node</th>
                                        <th className="text-left py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sequence ID</th>
                                        <th className="text-left py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Signature</th>
                                        <th className="text-right py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4">Actions Entry</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredPatients.map((patient, idx) => (
                                        <motion.tr
                                            key={patient.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-peacock-50/30 transition-colors"
                                        >
                                            <td className="py-6 pl-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-slate-100 shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                                                        <img src={patient.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                                                    </div>
                                                    <div className="font-black text-slate-900 text-lg uppercase italic">{patient.name}</div>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="font-bold text-slate-400 text-sm tracking-widest uppercase">{patient.id}</div>
                                            </td>
                                            <td className="py-6">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{patient.bloodGroup} Node</span>
                                                </div>
                                            </td>
                                            <td className="py-6 pr-4 text-right">
                                                <button
                                                    onClick={() => handleDispatch(patient.id)}
                                                    className="inline-flex items-center gap-2 bg-peacock-900 text-white font-black px-6 py-3 rounded-2xl hover:bg-peacock-800 transition-all active:scale-95 shadow-lg shadow-peacock-900/20 text-xs tracking-tighter"
                                                >
                                                    DISPATCH TO TRIAGE <ChevronRight size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredPatients.length === 0 && (
                                <div className="py-32 text-center text-slate-300">
                                    <LayoutGrid size={64} className="mx-auto mb-6 opacity-10" />
                                    <p className="font-black uppercase tracking-[0.3em] text-xs">No Nodes Found in Current Loop</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHub;
