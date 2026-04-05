'use client';

import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8"
        >
          <Sparkles size={16} />
          <span>Hackathon-Winning Solution for PS02</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-tight"
        >
          From paper registers to <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            predictive intelligence.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Most teams build a simple CRUD app. We built an AI-powered living intelligence system that predicts, automates, and learns. One platform for the entire hostel ecosystem.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="w-full sm:w-auto px-8 py-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-lg transition-all flex items-center justify-center gap-2 group">
            Explore the Pitch
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-lg transition-all border border-slate-700">
            View Live Demo
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto text-left border-t border-slate-800 pt-10"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 text-cyan-400"><Zap size={20} /></div>
            <div>
              <h3 className="font-semibold text-white">92% Satisfaction</h3>
              <p className="text-sm text-slate-400">Proven increase in student happiness.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 text-emerald-400"><ShieldCheck size={20} /></div>
            <div>
              <h3 className="font-semibold text-white">Zero Surprises</h3>
              <p className="text-sm text-slate-400">Predictive maintenance prevents breakdowns.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 text-purple-400"><Sparkles size={20} /></div>
            <div>
              <h3 className="font-semibold text-white">AI Co-pilot</h3>
              <p className="text-sm text-slate-400">Saves wardens 3-4 hours per day.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
