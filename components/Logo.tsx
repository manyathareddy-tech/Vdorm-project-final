'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

export default function Logo() {
  const [particles] = useState(() => {
    return [...Array(5)].map(() => ({
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
    }));
  });

  return (
    <div className="relative inline-flex items-center group cursor-pointer">
      <motion.div 
        className="text-3xl font-extrabold tracking-tighter text-blue-900 drop-shadow-sm"
        whileHover={{ scale: 1.02 }}
      >
        V<span className="text-blue-600">Dorm</span>
      </motion.div>
      
      {/* Animated Particles on Hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              x: p.x,
              y: p.y,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut"
            }}
            style={{
              top: '50%',
              left: '50%',
            }}
          />
        ))}
      </div>
    </div>
  );
}
