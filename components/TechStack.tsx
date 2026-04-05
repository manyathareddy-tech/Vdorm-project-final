'use client';

import { motion } from 'motion/react';
import { Layers, Database, Cpu, Smartphone, Cloud, Shield } from 'lucide-react';

const tech = [
  { icon: <Smartphone />, name: 'Frontend', desc: 'React.js (PWA) / React Native' },
  { icon: <Layers />, name: 'Backend', desc: 'Node.js + Express / FastAPI' },
  { icon: <Database />, name: 'Database', desc: 'PostgreSQL + Redis' },
  { icon: <Cpu />, name: 'AI / ML', desc: 'TensorFlow.js + Gemini API' },
  { icon: <Cloud />, name: 'Real-time', desc: 'Socket.io + Firebase Cloud Messaging' },
  { icon: <Shield />, name: 'Auth', desc: 'JWT + Role-based Middleware' },
];

export default function TechStack() {
  return (
    <section className="py-24 px-6 bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Feasible Tech Stack</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Built for a 24-36 hour hackathon sprint, scaling to thousands of residents.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {tech.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center gap-3 hover:border-cyan-500/30 transition-colors"
            >
              <div className="text-slate-400">{item.icon}</div>
              <div>
                <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
