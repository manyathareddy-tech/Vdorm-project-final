'use client';

import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Building2 size={20} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">HostelNexus</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#problem" className="hover:text-cyan-400 transition-colors">The Problem</a>
          <a href="#pillars" className="hover:text-cyan-400 transition-colors">Innovation</a>
          <a href="#roles" className="hover:text-cyan-400 transition-colors">Roles</a>
          <a href="#impact" className="hover:text-cyan-400 transition-colors">Impact</a>
        </div>
        <button className="px-4 py-2 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors">
          View Demo
        </button>
      </div>
    </motion.nav>
  );
}
