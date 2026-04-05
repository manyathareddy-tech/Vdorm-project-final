'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function MagnifyingCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] overflow-hidden"
      style={{
        width: '40px',
        height: '40px',
        backdropFilter: 'blur(2px) brightness(1.1)',
        WebkitBackdropFilter: 'blur(2px) brightness(1.1)',
        x: mousePosition.x - 20,
        y: mousePosition.y - 20,
      }}
      transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
    />
  );
}
