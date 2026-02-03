import React, { useState } from 'react';
import { useAppContext } from './context/AppContext';
import RoleSelector from './components/RoleSelector';
import PatientPortal from './components/patient/PatientPortal';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import PharmacistPortal from './components/pharmacist/PharmacistPortal';
import AdminHub from './components/admin/AdminHub';
import EmergencyMode from './components/emergency/EmergencyMode';
import { LogOut, Menu, X, Shield, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const { currentUser, setCurrentUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!currentUser) {
    return <RoleSelector />;
  }

  const renderPortal = () => {
    switch (currentUser.role) {
      case 'patient': return <PatientPortal />;
      case 'doctor': return <DoctorDashboard />;
      case 'pharmacist': return <PharmacistPortal />;
      case 'admin': return <AdminHub />;
      case 'emergency': return <EmergencyMode />;
      default: return <RoleSelector />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-clinical-100 selection:text-clinical-900">
      {/* Unified Clinical Header */}
      <nav className="sticky top-4 z-50 px-4 md:px-8 mb-4">
        <div className="max-w-7xl mx-auto glass-morph rounded-3xl md:rounded-[2.5rem] px-6 py-4 flex items-center justify-between shadow-premium border border-white/50">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 180 }}
              className="w-12 h-12 bg-clinical-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-clinical-900/20"
            >
              <Shield size={24} />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                LIFE<span className="text-clinical-500">STACK</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Global Health System</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {/* Profile Stub */}
            <div className="flex items-center gap-3 pr-2 md:pr-6 md:border-r border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 leading-none">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-clinical-500 uppercase tracking-widest mt-1">{currentUser.role} NODE</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-clinical-50 flex items-center justify-center text-clinical-600 font-black">
                {currentUser.name[0]}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentUser(null)}
                className="hidden md:flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                title="Exit Session"
              >
                <LogOut size={20} />
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-slate-900"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 left-4 right-4 z-40 md:hidden bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 shadow-2xl border border-white"
            >
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active User</p>
                  <p className="text-lg font-black text-slate-900">{currentUser.name}</p>
                  <p className="text-xs font-bold text-clinical-600 uppercase tracking-widest">{currentUser.role} Access</p>
                </div>

                <button
                  onClick={() => setCurrentUser(null)}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-black transition-active active:scale-95"
                >
                  <LogOut size={20} /> TERMINATE SESSION
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUser.role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            {renderPortal()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Mobile Bottom Nav Placeholder (for future) */}
      <div className="fixed bottom-0 left-0 right-0 h-20 md:hidden bg-white/80 backdrop-blur-xl border-t border-slate-100 px-8 flex items-center justify-around z-50">
        <button className="text-clinical-600 bg-clinical-50 p-3 rounded-2xl shadow-glow">
          <LayoutGrid size={24} />
        </button>
        <div className="w-12 h-12 rounded-full bg-clinical-900 flex items-center justify-center text-white shadow-premium">
          <Shield size={24} />
        </div>
        <button className="text-slate-400 p-3">
          <LogOut size={24} onClick={() => setCurrentUser(null)} />
        </button>
      </div>
    </div>
  );
};

export default App;
