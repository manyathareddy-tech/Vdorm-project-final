'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { User, ShieldCheck, X } from 'lucide-react';
import { getInitialData } from '@/lib/mockData';
import Particles from '@/components/Particles';
import PremiumButton from '@/components/PremiumButton';

export default function LandingPage() {
  const [modalType, setModalType] = useState<'student' | 'admin' | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize mock data on first load
    getInitialData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'student') router.push('/student');
    if (modalType === 'admin') router.push('/warden');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#22d3ee", "#38bdf8"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
        />
      </div>

      {/* Header */}
      <header className="p-6 relative z-10">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight drop-shadow-lg"
        >
          Welcome to <span className="text-cyan-400">VDorm</span>
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-center">
          {/* Student Portal Card */}
          <motion.div
            onClick={() => setModalType('student')}
            className="w-full max-w-sm aspect-[10/8] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl cursor-pointer flex flex-col items-center justify-center p-8 group relative overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-colors duration-300" />
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-cyan-500/30">
              <User size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Student Portal</h2>
            <p className="text-slate-300 text-center text-sm">Access your dashboard, raise complaints, and view hostel events.</p>
          </motion.div>

          {/* Admin Portal Card */}
          <motion.div
            onClick={() => setModalType('admin')}
            className="w-full max-w-sm aspect-[10/8] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl cursor-pointer flex flex-col items-center justify-center p-8 group relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-colors duration-300" />
            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-blue-500/30">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Hostel Administration</h2>
            <p className="text-slate-300 text-center text-sm">Manage students, track maintenance, and monitor live status.</p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center relative z-10">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-400 text-sm font-medium"
        >
          Proudly built for <span className="text-cyan-400 font-semibold">Vellore Institute of Technology</span>. <br className="md:hidden" />
          Empowering smart campuses with next-generation hostel management.
        </motion.p>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {modalType && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
            >
              <button 
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className={`p-6 text-white relative overflow-hidden`}>
                <div className={`absolute inset-0 opacity-20 ${modalType === 'student' ? 'bg-cyan-500' : 'bg-blue-500'}`} />
                <h3 className="text-2xl font-bold relative z-10">{modalType === 'student' ? 'Student Login' : 'Admin Login'}</h3>
                <p className="text-slate-300 text-sm mt-1 relative z-10">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleLogin} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    {modalType === 'student' ? 'Username / Reg ID' : 'Employee ID'}
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-slate-500"
                    placeholder={modalType === 'student' ? 'e.g. 21BCE0001' : 'e.g. EMP1234'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-slate-500 font-mono tracking-widest"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Captcha: What is 3 + 4?</label>
                  <input 
                    type="text" 
                    required
                    pattern="7"
                    title="Please enter the correct answer (7)"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-slate-500"
                    placeholder="Enter answer"
                  />
                </div>
                <div className="pt-2">
                  <PremiumButton type="submit" className="w-full">
                    Login
                  </PremiumButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
