'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Settings, Wrench } from 'lucide-react';

const roles = [
  {
    id: 'student',
    label: 'Student',
    icon: <User size={18} />,
    powers: [
      'View room details & roommate compatibility score',
      'Raise complaints with photo/video upload',
      'Apply for gate pass/outing via app',
      'Chat with AI bot for instant answers',
      'View mess schedule and EcoAI leaderboard'
    ]
  },
  {
    id: 'warden',
    label: 'Warden',
    icon: <Shield size={18} />,
    powers: [
      'View floor-wise student list & occupancy',
      'Approve gate passes in 2 clicks',
      'Receive late entry anomaly alerts (Welfare checks)',
      'Assign maintenance tasks & track SLAs',
      'Review AI-suggested room allocations'
    ]
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: <Settings size={18} />,
    powers: [
      'Full dashboard with predictive analytics',
      'View maintenance heatmaps by block',
      'Generate ESG reports for funding pitches',
      'Manage wardens, staff, and global settings',
      'Monitor overall energy savings'
    ]
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: <Wrench size={18} />,
    powers: [
      'See assigned tickets with SLA countdowns',
      'Update status in real-time',
      'Upload photo proof of fix',
      'Receive automated predictive work orders',
      'View historical issue data for specific rooms'
    ]
  }
];

export default function Roles() {
  const [activeRole, setActiveRole] = useState(roles[0].id);

  return (
    <section id="roles" className="py-24 px-6 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Role-Based Access</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Blockchain-secured logins ensure privacy. Every user gets exactly the tools they need.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 md:w-64 shrink-0">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all whitespace-nowrap ${
                  activeRole === role.id 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                }`}
              >
                {role.icon}
                <span className="font-medium">{role.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 min-h-[300px]">
            <AnimatePresence mode="wait">
              {roles.map((role) => (
                role.id === activeRole && (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      {role.icon}
                      {role.label} Powers
                    </h3>
                    <ul className="space-y-4">
                      {role.powers.map((power, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span className="text-lg">{power}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
