import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const SparkleCursor: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Check if device supports fine pointer (mouse) and user hasn't preferred reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const colors = ['#FF70B8', '#FFE66D', '#B99AFF', '#83D9FF', '#A5F3C1'];
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 35) return; // throttle sparkle creation
      lastTime = now;

      const newSparkle: Sparkle = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.floor(Math.random() * 8) + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setSparkles(prev => [...prev.slice(-14), newSparkle]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const cleanupInterval = setInterval(() => {
      setSparkles(prev => prev.slice(1));
    }, 70);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanupInterval);
    };
  }, []);

  if (sparkles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {sparkles.map((sp, idx) => {
        const opacity = (idx + 1) / sparkles.length;
        return (
          <div
            key={sp.id}
            style={{
              left: `${sp.x}px`,
              top: `${sp.y}px`,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              backgroundColor: sp.color,
              opacity: opacity * 0.75,
              transform: `translate(-50%, -50%) rotate(${idx * 25}deg)`,
            }}
            className="absolute rounded-full shadow-xs transition-opacity duration-300"
          />
        );
      })}
    </div>
  );
};
