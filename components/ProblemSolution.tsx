'use client';

import { motion } from 'motion/react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export default function ProblemSolution() {
  return (
    <section id="problem" className="py-24 px-6 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">The Paradigm Shift</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Why traditional systems fail and how HostelNexus redefines campus living.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-slate-900 border border-red-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <XCircle className="text-red-400" />
              The Status Quo
            </h3>
            <ul className="space-y-4">
              {[
                'Disconnected paper files and WhatsApp groups',
                'Reactive maintenance (fixing after it breaks)',
                'Manual, biased room allocation by wardens',
                'Slow grievance resolution with no transparency',
                'High energy waste in empty rooms'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/50 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-cyan-400" />
              HostelNexus
            </h3>
            <ul className="space-y-4">
              {[
                'Centralized cloud dashboard with instant search',
                'AI-driven predictive maintenance forecasts',
                'Algorithm-based roommate compatibility matching',
                'Automated SLA tracking and escalation',
                'IoT-powered energy optimization (EcoAI)'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
