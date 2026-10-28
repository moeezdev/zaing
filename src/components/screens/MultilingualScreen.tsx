import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { BatHeartEmblem } from '../BatmanDetails';
import { sound } from '../../utils/sound';

interface MultilingualScreenProps {
  onContinue: () => void;
}

interface LovePhrase {
  lang: string;
  text: string;
  english: string;
  size: string;
  top: string;
  left: string;
  rotation: number;
  color: string;
  delay: number;
  duration: number;
}

export const MultilingualScreen: React.FC<MultilingualScreenProps> = ({ onContinue }) => {
  const [showButton, setShowButton] = useState(false);

  // Multilingual translations specified in prompt
  const baseTranslations = [
    { lang: 'English', text: 'I Love You', english: 'I Love You' },
    { lang: 'Urdu', text: 'میں تم سے محبت کرتا ہوں', english: 'Urdu' },
    { lang: 'Roman Urdu', text: 'Main Tumse Pyaar Karta Hoon', english: 'Roman Urdu' },
    { lang: 'French', text: "Je t'aime", english: 'French' },
    { lang: 'Spanish', text: 'Te amo', english: 'Spanish' },
    { lang: 'Italian', text: 'Ti amo', english: 'Italian' },
    { lang: 'German', text: 'Ich liebe dich', english: 'German' },
    { lang: 'Turkish', text: 'Seni seviyorum', english: 'Turkish' },
    { lang: 'Arabic', text: 'أحبك', english: 'Arabic' },
    { lang: 'Hindi', text: 'मैं तुमसे प्यार करता हूँ', english: 'Hindi' },
    { lang: 'Korean', text: '사랑해', english: 'Korean' },
    { lang: 'Japanese', text: '愛してる', english: 'Japanese' },
    { lang: 'Portuguese', text: 'Eu te amo', english: 'Portuguese' },
    { lang: 'Bengali', text: 'আমি তোমাকে ভালোবাসি', english: 'Bengali' },
  ];

  // Distribute phrases nicely across viewport coordinates with slight jitter
  const colors = [
    'text-pink-600',
    'text-rose-500',
    'text-pink-700',
    'text-rose-700',
    'text-pink-800',
    'text-rose-600',
    'text-zinc-900', // batman touch
  ];

  const sizes = [
    'text-base sm:text-lg',
    'text-lg sm:text-xl font-medium',
    'text-xl sm:text-2xl font-semibold',
    'text-2xl sm:text-3xl font-bold font-display',
    'text-sm sm:text-base',
  ];

  // Generate 26 balanced floating declarations
  const phrases: LovePhrase[] = React.useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => {
      const trans = baseTranslations[i % baseTranslations.length];
      const row = Math.floor(i / 5);
      const col = i % 5;

      const top = `${12 + row * 16 + (Math.random() * 8 - 4)}%`;
      const left = `${8 + col * 18 + (Math.random() * 8 - 4)}%`;
      const rotation = Math.floor(Math.random() * 20 - 10);
      const color = colors[i % colors.length];
      const size = sizes[i % sizes.length];
      const delay = 0.15 + (i * 0.12);
      const duration = 4.5 + Math.random() * 3;

      return {
        lang: trans.lang,
        text: trans.text,
        english: trans.english,
        size,
        top,
        left,
        rotation,
        color,
        delay,
        duration,
      };
    });
  }, []);

  // Reveal button after a short reading animation delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    sound.playSparkle();
    onContinue();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 z-10 overflow-hidden">
      {/* Top Banner */}
      <div className="absolute top-6 left-6 z-30 flex items-center gap-2 text-xs text-pink-800 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200/80 shadow-sm">
        <BatHeartEmblem size={18} color="#18181b" />
        <span className="font-medium">Every Language, Every Universe</span>
      </div>

      {/* Center Title Pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="z-20 text-center max-w-lg mx-auto bg-white/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-pink-200/90 shadow-2xl shadow-pink-200/60"
      >
        <span className="text-3xl sm:text-4xl">🌍💖✨</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-pink-950 mt-2 mb-2">
          In Every Language Across The World
        </h2>
        <p className="text-xs sm:text-sm text-pink-800 font-medium">
          No matter which words are spoken, my heart beats for you in all of them.
        </p>

        {/* Revealed Action Button */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="mt-6"
          >
            <button
              onClick={handleNext}
              className="group relative overflow-hidden px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-pink-500 via-rose-500 to-zinc-900 shadow-xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2 tracking-wider">
                ONE LAST SURPRISE 🦇💗
              </span>
              <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" style={{ animationDuration: '3s' }} />
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Floating multilingual phrases drifting on the canvas */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {phrases.map((phrase, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{
              opacity: [0, 0.95, 0.85, 0.95],
              scale: [0.8, 1, 1.05, 1],
              y: [0, -15, 0],
            }}
            transition={{
              duration: phrase.duration,
              delay: phrase.delay,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            className={`absolute select-none px-3 py-1.5 rounded-xl bg-white/40 backdrop-blur-[2px] border border-pink-100/60 shadow-sm ${phrase.size} ${phrase.color}`}
            style={{
              top: phrase.top,
              left: phrase.left,
              transform: `rotate(${phrase.rotation}deg)`,
            }}
          >
            <div className="flex items-center gap-1.5">
              <span>{phrase.text}</span>
              <span className="text-[10px] text-pink-400 font-sans tracking-normal opacity-70">
                ({phrase.lang})
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
