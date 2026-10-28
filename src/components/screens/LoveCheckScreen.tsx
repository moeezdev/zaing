import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { BatHeartEmblem } from '../BatmanDetails';
import { sound } from '../../utils/sound';

interface LoveCheckScreenProps {
  onYes: () => void;
}

export const LoveCheckScreen: React.FC<LoveCheckScreenProps> = ({ onYes }) => {
  const [hasClickedYes, setHasClickedYes] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  // Playful evasion taunts
  const dodgeTaunts = [
    "Are you really trying to click NO? 🙄",
    "Hey! That button is illegal! 🏃💨",
    "Batman says: Access Denied! 🦇",
    "Nope! Try again! 😜",
    "You can't escape my love! 💕",
    "There's literally only one option! 💖",
    "Nice try, my favorite human! 🥹",
  ];

  // Move the NO button away to a safe position inside viewport
  const evadeNoButton = useCallback(() => {
    sound.playDodge();
    setNoCount((prev) => prev + 1);

    if (!containerRef.current || !noButtonRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const btnBounds = noButtonRef.current.getBoundingClientRect();

    // Ensure safe bounds within the container / screen
    const padding = 24;
    const maxX = Math.max(100, (bounds.width || window.innerWidth) / 2 - btnBounds.width - padding);
    const maxY = Math.max(80, (bounds.height || window.innerHeight) / 2 - btnBounds.height - padding);

    // Pick a new random offset ensuring it actually moves significantly
    let newX = (Math.random() * 2 - 1) * maxX;
    let newY = (Math.random() * 2 - 1) * maxY;

    // Prevent placing right on top of YES button (around center)
    if (Math.abs(newX) < 60 && Math.abs(newY) < 60) {
      newX = newX < 0 ? newX - 90 : newX + 90;
      newY = newY < 0 ? newY - 70 : newY + 70;
    }

    setNoButtonPos({ x: newX, y: newY });
  }, []);

  const handleYes = () => {
    if (hasClickedYes) return;
    setHasClickedYes(true);
    sound.playPop();
    sound.playChime();

    // Trigger Heart Confetti Explosion
    const duration = 2500;
    const end = Date.now() + duration;

    const colors = ['#f472b6', '#fb7185', '#ec4899', '#fda4af', '#1e1b4b'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        shapes: ['circle'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        shapes: ['circle'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Advance to next screen smoothly
    setTimeout(() => {
      onYes();
    }, 2400);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 z-10 overflow-hidden"
    >
      {/* Decorative Top Pill */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-xs text-pink-800 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200/80 shadow-sm">
        <BatHeartEmblem size={18} color="#18181b" />
        <span className="font-medium">Mandatory Love Verification</span>
      </div>

      <div className="w-full max-w-xl mx-auto text-center relative z-20">
        {/* Animated Big Bouncing Romantic Heart with Chibi Batman vibe */}
        <div className="relative mb-6 flex justify-center items-center">
          <motion.div
            animate={
              hasClickedYes
                ? { scale: [1, 1.3, 1.15], rotate: [0, -5, 5, 0] }
                : { scale: [1, 1.08, 1], y: [0, -8, 0] }
            }
            transition={{ duration: hasClickedYes ? 0.6 : 2.5, repeat: hasClickedYes ? 0 : Infinity }}
            className="relative"
          >
            <div className="w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center relative">
              {/* Soft Pink Heart */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                <defs>
                  <linearGradient id="loveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff758c" />
                    <stop offset="50%" stopColor="#ff7eb3" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                <path
                  d="M 50 88 C 20 60, 5 40, 5 25 C 5 12, 16 3, 29 3 C 38 3, 46 8, 50 16 C 54 8, 62 3, 71 3 C 84 3, 95 12, 95 25 C 95 40, 80 60, 50 88 Z"
                  fill="url(#loveGrad)"
                />
              </svg>

              {/* Batman Ears & Eye Mask atop the heart */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {/* Cute Bat Ears */}
                <div className="flex justify-between w-20 -mt-16 sm:-mt-20">
                  <div className="w-4 h-8 bg-zinc-900 rounded-t-full rotate-[-15deg] shadow-sm" />
                  <div className="w-4 h-8 bg-zinc-900 rounded-t-full rotate-[15deg] shadow-sm" />
                </div>

                {hasClickedYes ? (
                  <div className="text-4xl sm:text-5xl animate-bounce mt-4">🥹💗</div>
                ) : (
                  <div className="flex flex-col items-center mt-2">
                    {/* Cute blushy face */}
                    <div className="flex items-center gap-6 mt-1">
                      <div className="w-3 h-3 rounded-full bg-zinc-900" />
                      <div className="w-3 h-3 rounded-full bg-zinc-900" />
                    </div>
                    <div className="w-3 h-1.5 border-b-2 border-zinc-900 rounded-full mt-1" />
                    <div className="flex gap-7 -mt-2">
                      <span className="w-3 h-2 rounded-full bg-rose-400/60 blur-[1px]" />
                      <span className="w-3 h-2 rounded-full bg-rose-400/60 blur-[1px]" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Orbiting sparkles */}
            <span className="absolute -top-2 right-4 text-2xl animate-pulse">✨</span>
            <span className="absolute bottom-2 -left-2 text-2xl animate-bounce">💖</span>
          </motion.div>
        </div>

        {/* Headings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-pink-950 tracking-tight mb-3">
            Do You Love Me or Not? 🥺💗
          </h2>
          <p className="text-sm sm:text-base text-pink-800/85 max-w-md mx-auto mb-8 font-normal leading-relaxed">
            Be honest with me... there's only one right answer{' '}
            <span className="italic text-pink-900/70">(just kidding... maybe 👀)</span>
          </p>
        </motion.div>

        {/* Success Banner if clicked YES */}
        <AnimatePresence>
          {hasClickedYes && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white rounded-3xl shadow-xl shadow-pink-500/30 font-display text-xl sm:text-2xl font-bold flex items-center justify-center gap-3 animate-pulse"
            >
              <Sparkles className="w-6 h-6 animate-spin text-yellow-200" />
              <span>I KNEW IT! YOU LOVE ME! 🥹💗</span>
              <Sparkles className="w-6 h-6 animate-spin text-yellow-200" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Evasion Alert Note when trying to click NO */}
        {!hasClickedYes && noCount > 0 && (
          <motion.div
            key={noCount}
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-pink-100/90 border border-pink-300 rounded-full text-xs sm:text-sm font-medium text-pink-900 shadow-sm"
          >
            <span>{dodgeTaunts[(noCount - 1) % dodgeTaunts.length]}</span>
          </motion.div>
        )}

        {/* Interactive Action Buttons */}
        <div className="relative min-h-[140px] flex items-center justify-center gap-6 sm:gap-8 mt-2">
          {/* YES Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYes}
            disabled={hasClickedYes}
            className={`px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg text-white shadow-xl transition-all cursor-pointer z-30 ${
              hasClickedYes
                ? 'bg-rose-600 shadow-rose-300'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:shadow-pink-500/50 shadow-pink-400/40 animate-pulse-glow'
            }`}
          >
            <span className="flex items-center gap-2 tracking-wide">
              YES, I LOVE YOU! 💖
            </span>
          </motion.button>

          {/* NO Button (Playfully evades cursor & finger) */}
          <motion.button
            ref={noButtonRef}
            animate={{
              x: noButtonPos.x,
              y: noButtonPos.y,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 22,
            }}
            onMouseEnter={evadeNoButton}
            onClick={evadeNoButton}
            onTouchStart={(e) => {
              e.preventDefault();
              evadeNoButton();
            }}
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base text-zinc-700 bg-white/90 border border-pink-200 shadow-md hover:bg-zinc-50 active:scale-90 transition-colors select-none cursor-pointer z-20"
          >
            NO 🙄
          </motion.button>
        </div>
      </div>
    </div>
  );
};
