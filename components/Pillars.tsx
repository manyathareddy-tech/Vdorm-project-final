'use client';

import { motion } from 'motion/react';
import { Users, Wrench, QrCode, Clock, MessageSquare, Leaf } from 'lucide-react';

const pillars = [
  {
    icon: <Users size={24} />,
    title: 'Smart Room Allocation',
    description: 'AI preference-matching algorithm pairs roommates based on sleep schedules, study habits, and noise tolerance. Saves wardens 3-4 hours per cycle.',
    color: 'from-blue-500/20 to-blue-500/0',
    iconColor: 'text-blue-400'
  },
  {
    icon: <Wrench size={24} />,
    title: 'Predictive Maintenance',
    description: 'The Wow Factor. ML analyzes past complaints to forecast issues (e.g., plumbing leaks before monsoon). Generates automated work orders.',
    color: 'from-orange-500/20 to-orange-500/0',
    iconColor: 'text-orange-400'
  },
  {
    icon: <QrCode size={24} />,
    title: 'Smart Gate Intelligence',
    description: 'QR/OTP entry builds behavioral baselines. Anomaly detection flags unusual late entries for welfare checks, not just logging.',
    color: 'from-purple-500/20 to-purple-500/0',
    iconColor: 'text-purple-400'
  },
  {
    icon: <Clock size={24} />,
    title: 'SLA Grievance Tracking',
    description: 'Every complaint gets a ticket with an SLA. Live status for students, overdue alerts for wardens, and monthly sentiment reports.',
    color: 'from-rose-500/20 to-rose-500/0',
    iconColor: 'text-rose-400'
  },
  {
    icon: <MessageSquare size={24} />,
    title: '24/7 AI Chatbot',
    description: 'Instant answers for mess timings, gate pass processes, and room changes. Resolves 70% of routine queries instantly.',
    color: 'from-cyan-500/20 to-cyan-500/0',
    iconColor: 'text-cyan-400'
  },
  {
    icon: <Leaf size={24} />,
    title: 'EcoAI Sustainability',
    description: 'Analyzes IoT data to auto-control lights/AC. Gamifies conservation with leaderboards, slashing energy costs by up to 30%.',
    color: 'from-emerald-500/20 to-emerald-500/0',
    iconColor: 'text-emerald-400'
  }
];

export default function Pillars() {
  return (
    <section id="pillars" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">The 5 Innovation Pillars</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Each pillar is designed to be a &quot;Judge Magnet&quot; — solving real problems with cutting-edge technology.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${pillar.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
              <div className={`w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 relative z-10 ${pillar.iconColor}`}>
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{pillar.title}</h3>
              <p className="text-slate-400 leading-relaxed relative z-10">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
