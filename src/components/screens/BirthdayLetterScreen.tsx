import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Heart, Send, Cake } from 'lucide-react';
import { BatHeartEmblem } from '../BatmanDetails';
import { PhotoMemories } from '../PhotoMemories';
import { sound } from '../../utils/sound';

interface BirthdayLetterScreenProps {
  onReplay: () => void;
}

export const BirthdayLetterScreen: React.FC<BirthdayLetterScreenProps> = ({ onReplay }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // The exact requested letter content separated into romantic paragraphs
  const letterParagraphs = [
    {
      title: true,
      text: 'Happy Birthday, Baby! 🎂💗🦇',
    },
    {
      title: false,
      text: 'Happy birthday to my favorite person in this whole world. I hope your day is filled with happiness, smiles, love, and all the beautiful things you deserve.',
    },
    {
      title: false,
      text: 'You make ordinary moments feel special, and I hope today reminds you just how loved and important you are.',
    },
    {
      title: false,
      text: "If I could give you one thing for your birthday, it would be the ability to see yourself through my eyes, because then you'd understand just how special you are to me.",
    },
    {
      title: false,
      text: 'May this new chapter of your life bring you endless happiness, success, peace, and beautiful memories.',
    },
    {
      title: false,
      text: 'And no matter how much you argue with me, remember one thing...',
    },
    {
      highlight: true,
      text: 'I LOVE YOU MORE. ALWAYS. 💗',
    },
    {
      signature: true,
      text: 'Happy Birthday, My Favorite Human. 🦇💖',
    },
  ];

  // Auto unfold envelope after 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      sound.playSparkle();
      triggerConfetti();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Stagger line-by-line reveal
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => {
        if (prev < letterParagraphs.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 450);
    return () => clearInterval(interval);
  }, [isOpen, letterParagraphs.length]);

  const triggerConfetti = () => {
    sound.playPop();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fb7185', '#ec4899', '#fbcfe8', '#18181b', '#f59e0b'],
    });
  };

  const handleReplayClick = () => {
    sound.playSparkle();
    onReplay();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 z-10 select-none">
      {/* Top Banner */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-xs text-pink-800 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200/80 shadow-sm z-30">
        <BatHeartEmblem size={18} color="#18181b" />
        <span className="font-medium">Batman's Gotham Love Letter</span>
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col items-center my-6 z-20">
        {/* Envelope Container */}
        <div className="relative w-full max-w-xl">
          {/* Envelope Flap Animation Wrapper */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* The Digital Love Letter Card */}
            <div className="relative bg-gradient-to-b from-[#fffafd] via-[#fff5f8] to-[#ffeef3] rounded-3xl p-6 sm:p-10 shadow-2xl shadow-pink-300/50 border border-pink-200/90 text-left overflow-hidden">
              {/* Decorative Batman Vignette in top-right corner */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-pink-100/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-200 shadow-sm">
                <BatHeartEmblem size={22} color="#18181b" />
                <span className="text-[11px] font-semibold text-pink-900 tracking-wider">
                  Bat-Certified Love
                </span>
              </div>

              {/* Decorative Bat Signal Image Thumbnail in corner */}
              <div className="absolute bottom-4 right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden opacity-30 pointer-events-none border border-pink-300">
                <img
                  src="/src/assets/images/cute_batman_pink_heart_1793193819211.jpg"
                  alt="Bat Heart"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Letter Header Accent */}
              <div className="flex items-center gap-2 mb-6 text-pink-400">
                <Sparkles className="w-4 h-4 text-pink-500 animate-spin" style={{ animationDuration: '6s' }} />
                <div className="h-[1px] w-16 bg-pink-200" />
                <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                <div className="h-[1px] flex-1 bg-pink-200" />
              </div>

              {/* Paragraphs with line-by-line reveal */}
              <div className="space-y-4 sm:space-y-5 text-zinc-800 leading-relaxed font-sans">
                {letterParagraphs.map((para, idx) => {
                  const isVisible = idx <= currentLineIndex;

                  if (para.title) {
                    return (
                      <motion.h1
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-pink-950 tracking-tight mb-4"
                      >
                        {para.text}
                      </motion.h1>
                    );
                  }

                  if (para.highlight) {
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="py-3 px-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 rounded-2xl border border-pink-300 my-2 shadow-sm text-center"
                      >
                        <p className="text-base sm:text-lg md:text-xl font-bold font-display text-rose-700 tracking-wide">
                          {para.text}
                        </p>
                      </motion.div>
                    );
                  }

                  if (para.signature) {
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="pt-2 text-right font-display text-lg sm:text-xl font-bold text-pink-900"
                      >
                        <p>{para.text}</p>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-sm sm:text-base text-zinc-700 font-normal leading-relaxed"
                    >
                      {para.text}
                    </motion.p>
                  );
                })}
              </div>

              {/* Bottom Animated Message */}
              <AnimatePresence>
                {currentLineIndex >= letterParagraphs.length && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mt-8 pt-6 border-t border-pink-200/80 text-center"
                  >
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/25 animate-pulse tracking-wide">
                      <Sparkles className="w-4 h-4 text-yellow-200" />
                      <span>YOU'LL ALWAYS BE MY FAVORITE PERSON 💗</span>
                      <Sparkles className="w-4 h-4 text-yellow-200" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Polaroid Memories of Him */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full mt-6"
          >
            <PhotoMemories />
          </motion.div>
        </div>

        {/* Action Controls & Replay Button */}
        <div className="mt-8 mb-12 flex flex-wrap items-center justify-center gap-4 z-30">
          {/* Confetti Trigger */}
          <button
            onClick={triggerConfetti}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-pink-700 font-semibold text-xs sm:text-sm border border-pink-300 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Cake className="w-4 h-4 text-pink-500" />
            <span>Celebrate Again 🎂</span>
          </button>

          {/* Replay Our Little Story Button */}
          <button
            onClick={handleReplayClick}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Our Little Story ↻</span>
          </button>
        </div>
      </div>
    </div>
  );
};
