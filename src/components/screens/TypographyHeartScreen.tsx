import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RotateCcw } from 'lucide-react';
import { sound } from '../../utils/sound';

interface TypographyHeartScreenProps {
  onProceedToLetter: () => void;
}

interface TextPoint {
  id: number;
  text: string;
  lang: string;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  targetAngle: number;
  startAngle: number;
  fontSize: number;
  color: string;
  glowColor: string;
  delay: number;
}

export const TypographyHeartScreen: React.FC<TypographyHeartScreenProps> = ({
  onProceedToLetter,
}) => {
  // Animation phases:
  // 1: 'empty' (black screen)
  // 2: 'appearing' (words fade in scattered across screen)
  // 3: 'forming' (words glide smoothly into heart formation)
  // 4: 'settled' (complete recognizable heart outline, empty black center)
  // 5: 'climax' (glow pulse & expand, revealing transition button)
  const [phase, setPhase] = useState<'empty' | 'appearing' | 'forming' | 'settled' | 'climax'>('empty');
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Exact multilingual love phrases specified
  const phrasesList = useMemo(
    () => [
      { text: 'I love you', lang: 'English' },
      { text: 'I love you more', lang: 'English' },
      { text: 'Te amo', lang: 'Spanish' },
      { text: "Je t'aime", lang: 'French' },
      { text: 'Ti amo', lang: 'Italian' },
      { text: 'Ich liebe dich', lang: 'German' },
      { text: 'Seni seviyorum', lang: 'Turkish' },
      { text: '사랑해', lang: 'Korean' },
      { text: '愛してる', lang: 'Japanese' },
      { text: 'Anh yêu em', lang: 'Vietnamese' },
      { text: 'Я тебя люблю', lang: 'Russian' },
      { text: 'Eu te amo', lang: 'Portuguese' },
      { text: 'Kocham cię', lang: 'Polish' },
      { text: 'Jag älskar dig', lang: 'Swedish' },
      { text: 'أحبك', lang: 'Arabic' },
      { text: 'میں تم سے محبت کرتا ہوں', lang: 'Urdu' },
      { text: 'Aku cinta kamu', lang: 'Indonesian' },
    ],
    []
  );

  // Vivid bold glowing red, coral, and neon pink colors matching the reference
  const glowingPalette = [
    { color: '#ff1744', glow: 'rgba(255, 23, 68, 0.9)' }, // Vivid Neon Red
    { color: '#ff3366', glow: 'rgba(255, 51, 102, 0.9)' }, // Hot Pinkish Red
    { color: '#ff5252', glow: 'rgba(255, 82, 82, 0.85)' }, // Glowing Coral
    { color: '#ff4081', glow: 'rgba(255, 64, 129, 0.9)' }, // Electric Rose Pink
    { color: '#f50057', glow: 'rgba(245, 0, 87, 0.95)' }, // Deep Crimson Neon
    { color: '#ff6b81', glow: 'rgba(255, 107, 129, 0.85)' }, // Soft Coral Pink
    { color: '#ff0844', glow: 'rgba(255, 8, 68, 0.95)' }, // Ruby Red
    { color: '#ff758c', glow: 'rgba(255, 117, 140, 0.85)' }, // Pastel Rose Glow
  ];

  // Mathematical parametric heart curve calculation
  // x = 16 sin^3(t)
  // y = -(13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t))
  const points: TextPoint[] = useMemo(() => {
    const items: TextPoint[] = [];
    let idCounter = 0;

    // Density of points along the perimeter contour:
    // Outer perimeter band (84 phrases)
    const countOuter = 84;
    for (let i = 0; i < countOuter; i++) {
      const t = (i / countOuter) * 2 * Math.PI;

      // Mathematical heart coordinates
      const rawX = 16 * Math.pow(Math.sin(t), 3);
      const rawY = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );

      // Tangent derivative for natural curve alignment
      const dx = 48 * Math.pow(Math.sin(t), 2) * Math.cos(t);
      const dy =
        13 * Math.sin(t) -
        10 * Math.sin(2 * t) -
        6 * Math.sin(3 * t) -
        4 * Math.sin(4 * t);
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      // Keep text right-side-up and easily readable
      if (angle > 90) angle -= 180;
      if (angle < -90) angle += 180;

      // Scale coordinates to fit desktop & mobile nicely
      const scale = 20;
      const targetX = rawX * scale;
      const targetY = rawY * scale;

      // Scattered starting position (Phase 2)
      const scatterRadius = 380 + Math.random() * 340;
      const scatterAngle = Math.random() * 2 * Math.PI;
      const startX = Math.cos(scatterAngle) * scatterRadius;
      const startY = Math.sin(scatterAngle) * scatterRadius;
      const startAngle = (Math.random() * 60 - 30);

      const phrase = phrasesList[idCounter % phrasesList.length];
      const palette = glowingPalette[idCounter % glowingPalette.length];

      items.push({
        id: idCounter++,
        text: phrase.text,
        lang: phrase.lang,
        targetX,
        targetY,
        startX,
        startY,
        targetAngle: angle * 0.72, // smooth tangent alignment
        startAngle,
        fontSize: Math.random() > 0.5 ? 13 : 11.5,
        color: palette.color,
        glowColor: palette.glow,
        delay: 0.8 + (i / countOuter) * 1.6 + Math.random() * 0.3,
      });
    }

    // Slightly offset interlocked perimeter ribbon (68 phrases) to create a thick, continuous outline
    // while keeping the middle completely empty and black
    const countInnerRibbon = 68;
    for (let i = 0; i < countInnerRibbon; i++) {
      // Offset sampling phase so words alternate and interlock naturally
      const t = ((i + 0.5) / countInnerRibbon) * 2 * Math.PI;

      // Inner scale slightly (0.92 - 0.94) to add outline thickness without filling center
      const ribbonScale = 0.925 + (Math.random() * 0.03 - 0.015);
      const rawX = 16 * Math.pow(Math.sin(t), 3) * ribbonScale;
      const rawY =
        -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        ) * ribbonScale;

      const dx = 48 * Math.pow(Math.sin(t), 2) * Math.cos(t);
      const dy =
        13 * Math.sin(t) -
        10 * Math.sin(2 * t) -
        6 * Math.sin(3 * t) -
        4 * Math.sin(4 * t);
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      if (angle > 90) angle -= 180;
      if (angle < -90) angle += 180;

      const scale = 20;
      const targetX = rawX * scale;
      const targetY = rawY * scale;

      const scatterRadius = 320 + Math.random() * 300;
      const scatterAngle = Math.random() * 2 * Math.PI;
      const startX = Math.cos(scatterAngle) * scatterRadius;
      const startY = Math.sin(scatterAngle) * scatterRadius;
      const startAngle = (Math.random() * 60 - 30);

      const phrase = phrasesList[(idCounter + 7) % phrasesList.length];
      const palette = glowingPalette[(idCounter + 3) % glowingPalette.length];

      items.push({
        id: idCounter++,
        text: phrase.text,
        lang: phrase.lang,
        targetX,
        targetY,
        startX,
        startY,
        targetAngle: angle * 0.68,
        startAngle,
        fontSize: 11,
        color: palette.color,
        glowColor: palette.glow,
        delay: 1.2 + (i / countInnerRibbon) * 1.5 + Math.random() * 0.3,
      });
    }

    return items;
  }, [phrasesList, animationKey]);

  // Execute Phase Timeline:
  // Phase 1 (Empty): 0s - 0.8s
  // Phase 2 (Words Appear Scattered): 0.8s - 2.8s
  // Phase 3 (Move into Formation): 2.8s - 5.8s
  // Phase 4 (Heart Outline Settled): 5.8s - 8.2s
  // Phase 5 (Climax Glow & Reveal): 8.2s+
  useEffect(() => {
    setPhase('empty');

    const t1 = setTimeout(() => {
      setPhase('appearing');
      sound.playSparkle();
    }, 700);

    const t2 = setTimeout(() => {
      setPhase('forming');
      sound.playPop();
    }, 2800);

    const t3 = setTimeout(() => {
      setPhase('settled');
      sound.playChime();
    }, 5800);

    const t4 = setTimeout(() => {
      setPhase('climax');
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [animationKey]);

  const handleReplayAnimation = () => {
    sound.playSparkle();
    setAnimationKey((prev) => prev + 1);
  };

  const handleProceed = () => {
    sound.playSparkle();
    onProceedToLetter();
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center px-2 py-4 z-20 overflow-hidden select-none transition-colors duration-1000">
      {/* Replay Button in corner */}
      <div className="absolute top-6 left-6 z-40 flex items-center gap-2">
        <button
          onClick={handleReplayAnimation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs border border-zinc-800 shadow-sm transition-all cursor-pointer"
          title="Replay Heart Formation Animation"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          <span>Replay Formation ↻</span>
        </button>
      </div>

      {/* Heart Canvas Stage */}
      <div className="relative w-full max-w-[760px] h-[520px] sm:h-[620px] flex items-center justify-center my-auto">
        {/* Subtle Ambient Red/Coral Glow behind the perimeter only during settled/climax */}
        <motion.div
          animate={
            phase === 'climax'
              ? { scale: [1, 1.08, 1], opacity: [0.15, 0.45, 0.25] }
              : phase === 'settled'
              ? { scale: [0.98, 1.02, 0.98], opacity: [0.15, 0.28, 0.15] }
              : { opacity: 0 }
          }
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[440px] h-[440px] sm:w-[540px] sm:h-[540px] rounded-full bg-rose-600/20 blur-[90px] pointer-events-none"
        />

        {/* SVG Viewport for Mathematical Text Heart */}
        <motion.svg
          viewBox="-380 -360 760 720"
          className="w-full h-full overflow-visible"
          animate={
            phase === 'climax'
              ? {
                  scale: [1, 1.05, 1],
                  filter: 'drop-shadow(0 0 16px rgba(255, 23, 68, 0.8))',
                }
              : phase === 'settled'
              ? {
                  scale: [0.99, 1.015, 0.99],
                  filter: 'drop-shadow(0 0 8px rgba(255, 23, 68, 0.5))',
                }
              : { scale: 1 }
          }
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {phase !== 'empty' &&
            points.map((pt) => {
              // Determine coordinate and opacity based on phase
              const isFormed = phase === 'forming' || phase === 'settled' || phase === 'climax';

              return (
                <motion.g
                  key={pt.id}
                  initial={{
                    x: pt.startX,
                    y: pt.startY,
                    opacity: 0,
                    scale: 0.4,
                    rotate: pt.startAngle,
                  }}
                  animate={{
                    x: isFormed ? pt.targetX : pt.startX,
                    y: isFormed ? pt.targetY : pt.startY,
                    opacity: isFormed ? 1 : 0.75,
                    scale: isFormed ? 1 : 0.85,
                    rotate: isFormed ? pt.targetAngle : pt.startAngle,
                  }}
                  transition={{
                    duration: phase === 'forming' ? 2.6 : 1.2,
                    delay: phase === 'forming' ? pt.delay * 0.45 : pt.delay * 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <text
                    x={0}
                    y={0}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={pt.fontSize}
                    fill={pt.color}
                    fontWeight="800"
                    letterSpacing="0.03em"
                    className="select-none font-sans"
                    style={{
                      textShadow: `0 0 8px ${pt.glowColor}, 0 0 16px ${pt.glowColor}, 0 0 24px rgba(255, 0, 80, 0.4)`,
                      fontFamily:
                        pt.lang === 'Urdu' || pt.lang === 'Arabic'
                          ? 'Noto Nastaliq Urdu, Plus Jakarta Sans, sans-serif'
                          : 'Plus Jakarta Sans, system-ui, sans-serif',
                    }}
                  >
                    {pt.text}
                  </text>
                </motion.g>
              );
            })}
        </motion.svg>
      </div>

      {/* Climax Reveal: Transition to Birthday Letter */}
      <div className="z-40 min-h-[70px] flex flex-col items-center justify-center pb-4">
        <AnimatePresence>
          {phase === 'climax' && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="flex flex-col items-center gap-2"
            >
              <button
                onClick={handleProceed}
                className="group relative overflow-hidden px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg text-white bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 shadow-2xl shadow-rose-600/50 hover:shadow-rose-600/70 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-3 border border-rose-400/50"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Heart className="w-5 h-5 fill-white text-white group-hover:scale-125 transition-transform" />
                <span className="relative tracking-wider font-semibold">
                  OPEN YOUR BIRTHDAY LETTER 🎂💌
                </span>
                <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
              </button>
              <span className="text-[11px] text-zinc-400 font-mono tracking-wide">
                Touch to reveal your birthday surprise
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
