'use client';

import { motion } from 'motion/react';

const metrics = [
  {
    value: '40%',
    label: 'Less Manual Work',
    description: 'For admins through centralized dashboard and analytics.'
  },
  {
    value: '50%+',
    label: 'Downtime Cut',
    description: 'Via AI-driven predictive maintenance and SLA tracking.'
  },
  {
    value: '₹5-10L',
    label: 'Yearly Savings',
    description: 'For a 1000-bed hostel using EcoAI energy optimization.'
  },
  {
    value: '92%',
    label: 'Satisfaction Boost',
    description: 'From transparent tracking and instant chatbot answers.'
  }
];

export default function Impact() {
  return (
    <section id="impact" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Quantifiable Impact</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Numbers that prove HostelNexus isn&apos;t just a utility platform—it&apos;s a strategic decision-making tool.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400 mb-4">
                {metric.value}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{metric.label}</h3>
              <p className="text-slate-400 text-sm">{metric.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
