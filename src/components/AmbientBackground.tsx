import React, { useEffect, useState } from 'react';
import { AmbientBat } from './BatmanDetails';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export const AmbientBackground: React.FC = () => {
  const [cursorSparkles, setCursorSparkles] = useState<SparkleParticle[]>([]);

  // Subtle floating background particles
  const floatingHearts = [
    { left: '8%', delay: '0s', duration: '9s', size: 16, icon: '💗' },
    { left: '18%', delay: '3s', duration: '12s', size: 22, icon: '✨' },
    { left: '28%', delay: '1.5s', duration: '10s', size: 18, icon: '💖' },
    { left: '42%', delay: '4s', duration: '14s', size: 14, icon: '🦇' },
    { left: '55%', delay: '2s', duration: '11s', size: 20, icon: '💕' },
    { left: '68%', delay: '5s', duration: '13s', size: 16, icon: '🌸' },
    { left: '80%', delay: '0.8s', duration: '10.5s', size: 18, icon: '💗' },
    { left: '92%', delay: '3.5s', duration: '12.5s', size: 15, icon: '✨' },
  ];

  // Subtle interactive trailing sparkles on move
  useEffect(() => {
    let count = 0;
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      count++;
      if (count % 3 !== 0) return; // throttle

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const newSparkle: SparkleParticle = {
        id: Date.now() + Math.random(),
        x: clientX,
        y: clientY,
        size: Math.random() * 8 + 6,
        opacity: 0.9,
      };

      setCursorSparkles((prev) => [...prev.slice(-12), newSparkle]);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const interval = setInterval(() => {
      setCursorSparkles((prev) =>
        prev
          .map((s) => ({ ...s, opacity: s.opacity - 0.15, y: s.y - 1.5 }))
          .filter((s) => s.opacity > 0)
      );
    }, 80);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dreamy Baby-Pink Soft Radial Gradient Aura */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff2f5] via-[#ffe5ec] to-[#fecdd3] opacity-90" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-100/50 blur-[100px]" />

      {/* Subtle Gotham Bat Silhouette details in the background sky */}
      <div className="absolute top-8 left-12 animate-float opacity-30">
        <AmbientBat size={32} opacity={0.35} />
      </div>
      <div className="absolute top-24 right-16 animate-float opacity-25" style={{ animationDelay: '2s' }}>
        <AmbientBat size={24} opacity={0.3} />
      </div>
      <div className="absolute bottom-20 left-20 animate-float opacity-20" style={{ animationDelay: '4s' }}>
        <AmbientBat size={28} opacity={0.25} />
      </div>

      {/* Floating gentle particles going upward */}
      {floatingHearts.map((item, idx) => (
        <div
          key={idx}
          className="absolute bottom-[-40px] select-none text-pink-400/60 font-sans"
          style={{
            left: item.left,
            fontSize: `${item.size}px`,
            animation: `floatUpward ${item.duration} linear infinite`,
            animationDelay: item.delay,
          }}
        >
          {item.icon}
        </div>
      ))}

      {/* Cursor Interactive Sparkles */}
      {cursorSparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full pointer-events-none transition-opacity"
          style={{
            left: sparkle.x - sparkle.size / 2,
            top: sparkle.y - sparkle.size / 2,
            width: sparkle.size,
            height: sparkle.size,
            background: 'radial-gradient(circle, #f472b6 0%, #fb7185 70%, transparent 100%)',
            opacity: sparkle.opacity,
            boxShadow: '0 0 8px rgba(244, 114, 182, 0.8)',
            transform: `scale(${sparkle.opacity})`,
          }}
        />
      ))}

      <style>{`
        @keyframes floatUpward {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-110vh) rotate(45deg) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
