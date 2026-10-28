import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Lock, KeyRound, Sparkles, HelpCircle } from 'lucide-react';
import { BatHeartEmblem } from '../BatmanDetails';
import { sound } from '../../utils/sound';

interface PasswordScreenProps {
  onUnlock: () => void;
}

export const PasswordScreen: React.FC<PasswordScreenProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSuccess) return;

    if (password.trim() === '2904') {
      setIsSuccess(true);
      setErrorMsg('');
      sound.playChime();
      sound.startBgm(); // Auto-start the romantic background melody on unlock!
      setTimeout(() => {
        onUnlock();
      }, 1200);
    } else {
      sound.playWrong();
      setIsShaking(true);
      setErrorMsg("Oops! That's not our secret 💕");
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 z-10">
      {/* Decorative Bat Signal Accent in upper corner */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-xs text-pink-700/80 bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200/60 shadow-sm">
        <BatHeartEmblem size={20} color="#18181b" />
        <span className="font-medium">Confidential Bat-Heart Protocol</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md mx-auto text-center"
      >
        {/* Central Floating Heart with Batman touch */}
        <div className="relative mb-6 flex justify-center items-center">
          <motion.div
            animate={
              isSuccess
                ? { scale: [1, 1.4, 2], opacity: [1, 1, 0] }
                : { y: [0, -10, 0], scale: [1, 1.03, 1] }
            }
            transition={
              isSuccess
                ? { duration: 1.1, ease: 'easeInOut' }
                : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative"
          >
            {/* Glowing Backdrop */}
            <div className="absolute inset-0 bg-pink-400/30 blur-2xl rounded-full scale-125" />

            {/* Heart SVG */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-xl filter drop-shadow-pink"
              >
                <defs>
                  <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff758c" />
                    <stop offset="50%" stopColor="#ff7eb3" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                <path
                  d="M 50 88 C 20 60, 5 40, 5 25 C 5 12, 16 3, 29 3 C 38 3, 46 8, 50 16 C 54 8, 62 3, 71 3 C 84 3, 95 12, 95 25 C 95 40, 80 60, 50 88 Z"
                  fill="url(#heartGrad)"
                />
              </svg>

              {/* Bat Silhouette Center Lock */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isSuccess ? (
                  <Sparkles className="w-10 h-10 text-white animate-spin" />
                ) : (
                  <div className="flex flex-col items-center">
                    <BatHeartEmblem size={34} color="#ffffff" />
                    <Lock className="w-3.5 h-3.5 text-white/90 -mt-0.5" />
                  </div>
                )}
              </div>
            </div>

            {/* Orbiting sparkles */}
            <span className="absolute -top-1 -right-2 text-xl animate-bounce">✨</span>
            <span className="absolute -bottom-2 -left-2 text-lg animate-pulse">💗</span>
          </motion.div>
        </div>

        {/* Headings */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-pink-950 tracking-tight mb-2">
          A Little Surprise For You 💗
        </h1>
        <p className="text-sm sm:text-base text-pink-800/80 font-normal mb-8 max-w-sm mx-auto">
          Only someone special knows the secret...
        </p>

        {/* Password Card Container */}
        <motion.div
          animate={isShaking ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-200/50 border border-pink-200/80 text-left relative overflow-hidden"
        >
          {/* Subtle bat watermark in corner */}
          <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none">
            <BatHeartEmblem size={140} color="#000000" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="passwordInput"
                className="block text-xs font-semibold uppercase tracking-wider text-pink-900 mb-2 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-pink-500" />
                  Enter Secret Passcode
                </span>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-pink-600 hover:text-pink-800 text-[11px] font-medium flex items-center gap-1 underline transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  Need a hint? 🦇
                </button>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Heart className="h-5 w-5 text-pink-400 fill-pink-100" />
                </div>
                <input
                  id="passwordInput"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter 4-digit secret..."
                  maxLength={10}
                  className="block w-full pl-11 pr-4 py-3 bg-pink-50/70 border border-pink-200 rounded-2xl text-pink-950 placeholder-pink-300 font-mono tracking-widest text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all shadow-inner"
                  autoFocus
                />
              </div>

              {/* Hint Callout */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-xs text-pink-700 bg-pink-100/70 p-2.5 rounded-xl border border-pink-200 flex items-center gap-2"
                  >
                    <span>🦇</span>
                    <span>Hint: Our special secret code is <strong className="font-mono text-pink-900 font-bold">2904</strong> 💕</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Notification */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1"
                  >
                    <span>💕</span>
                    <span>{errorMsg}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Unlock Button */}
            <button
              type="submit"
              disabled={isSuccess}
              className="w-full group relative overflow-hidden rounded-2xl py-3.5 px-6 font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2 text-base tracking-wide">
                Unlock My Heart 💌
              </span>
            </button>
          </form>
        </motion.div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-pink-600/70">
          Made with all my love, baby pink dreams & Batman cuddles 🦇💗
        </p>
      </motion.div>
    </div>
  );
};
