import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Camera, RotateCcw } from 'lucide-react';
import { BatHeartEmblem } from '../BatmanDetails';
import { sound } from '../../utils/sound';
import { getHeroPhoto, saveHeroPhoto } from '../../utils/photoStorage';

interface LoveMoreScreenProps {
  onProve: () => void;
}

export const LoveMoreScreen: React.FC<LoveMoreScreenProps> = ({ onProve }) => {
  const [heroPhoto, setHeroPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHeroPhoto(getHeroPhoto());
  }, []);

  const handleProveClick = () => {
    sound.playSparkle();
    onProve();
  };

  const handleUploadHero = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        sound.playPop();
        setHeroPhoto(dataUrl);
        saveHeroPhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetHero = () => {
    sound.playSparkle();
    setHeroPhoto(null);
    saveHeroPhoto(null);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 z-10 text-center">
      {/* Top Banner */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-xs text-pink-800 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200/80 shadow-sm">
        <BatHeartEmblem size={18} color="#18181b" />
        <span className="font-medium">Unconditional Truth Alert</span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-xl mx-auto flex flex-col items-center"
      >
        {/* Cute Batman & Pink Heart Showcase or Custom Photo of Him */}
        <div className="relative mb-4 group">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-pink-400/25 blur-3xl rounded-full scale-125" />

          {/* Card containing Hero Photo (His photo or Chibi Batman) */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 1, 0, -1, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-3 border-white/95 shadow-2xl shadow-pink-300/40 bg-gradient-to-b from-white/90 to-pink-50/90 p-2 flex items-center justify-center"
          >
            <img
              src={heroPhoto || '/src/assets/images/cute_batman_pink_heart_1793193819211.jpg'}
              alt={heroPhoto ? 'Photo of him' : 'Cute Batman holding a pink heart balloon'}
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />

            {/* Corner Bat Silhouette Badge */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md rounded-full p-1.5 shadow-md border border-pink-200">
              <BatHeartEmblem size={20} color="#18181b" />
            </div>

            {/* Hover overlay button to change photo */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-2xl">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-pink-700 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 hover:bg-pink-50 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{heroPhoto ? 'Change His Photo' : 'Put His Photo Here 📸'}</span>
              </button>
              {heroPhoto && (
                <button
                  onClick={handleResetHero}
                  className="px-3 py-1 bg-black/70 text-white rounded-full text-[11px] font-medium flex items-center gap-1 hover:bg-black/90 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Use Chibi Batman</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Floating mini hearts and sparkles */}
          <motion.span
            animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-3 -right-3 text-3xl"
          >
            💖
          </motion.span>
          <motion.span
            animate={{ y: [0, 8, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-2 -left-3 text-2xl"
          >
            🦇
          </motion.span>
        </div>

        {/* Change Photo input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUploadHero}
          className="hidden"
        />

        {/* Small inline trigger for mobile users who don't have hover */}
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-pink-700 hover:text-pink-900 bg-white/70 hover:bg-white px-3 py-1 rounded-full border border-pink-200/80 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-pink-500" />
            <span>{heroPhoto ? "Change His Photo 📸" : "Put His Photo Here 📸"}</span>
          </button>
          {heroPhoto && (
            <button
              onClick={handleResetHero}
              className="text-xs text-pink-600 hover:text-pink-800 underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Headings */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100/80 rounded-full border border-pink-200 text-pink-700 text-xs sm:text-sm font-semibold mb-3 shadow-sm">
            <span>✨ Undeniable Fact ✨</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-pink-950 tracking-tight mb-2">
            I LOVE YOU MORE! 💗
          </h2>

          <p className="text-base sm:text-lg text-pink-800/90 font-medium max-w-md mx-auto mb-8 leading-relaxed">
            And don't even try to argue with me about it 😤💕
          </p>
        </motion.div>

        {/* Interactive "PROVE YOUR LOVE 💌" Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProveClick}
          className="group relative overflow-hidden px-10 py-4 sm:py-4.5 rounded-2xl font-bold text-base sm:text-lg text-white bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 shadow-xl shadow-pink-500/35 hover:shadow-pink-500/50 transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Heart className="w-5 h-5 fill-white text-white group-hover:scale-125 transition-transform" />
          <span className="relative tracking-wider font-semibold">
            PROVE YOUR LOVE 💌
          </span>
          <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
        </motion.button>

        {/* Batman Gotham Love Quote */}
        <p className="mt-6 text-xs text-pink-600/75 italic">
          "Even Batman in all of Gotham couldn't protect his heart from loving you this much 🦇🖤"
        </p>
      </motion.div>
    </div>
  );
};
