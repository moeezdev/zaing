import React from 'react';

// Cute Batman Bat-Heart Emblem
export const BatHeartEmblem: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = '',
  size = 48,
  color = '#1f242d',
}) => {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform duration-300 ${className}`}
    >
      {/* Sleek Batman insignia with heart center */}
      <path
        d="M 50 12
           C 54 8, 56 4, 58 1
           L 60 7
           C 66 5, 75 8, 86 16
           C 78 20, 75 29, 82 38
           C 72 38, 64 45, 60 55
           C 56 46, 53 42, 50 42
           C 47 42, 44 46, 40 55
           C 36 45, 28 38, 18 38
           C 25 29, 22 20, 14 16
           C 25 8, 34 5, 40 7
           L 42 1
           C 44 4, 46 8, 50 12 Z"
        fill={color}
      />
      {/* Pink Glowing Mini Heart in Bat Emblem Center */}
      <path
        d="M 50 30
           C 48 26, 43 25, 41 28
           C 39 31, 41 35, 50 40
           C 59 35, 61 31, 59 28
           C 57 25, 52 26, 50 30 Z"
        fill="#f472b6"
      />
    </svg>
  );
};

// Subtle Floating Ambient Bat
export const AmbientBat: React.FC<{ className?: string; size?: number; opacity?: number }> = ({
  className = '',
  size = 24,
  opacity = 0.25,
}) => {
  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 100 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <path
        d="M 50 10
           C 53 6, 55 3, 57 0
           L 58 6
           C 64 4, 72 6, 82 14
           C 75 18, 73 26, 80 34
           C 70 34, 63 41, 59 50
           C 55 42, 52 38, 50 38
           C 48 38, 45 42, 41 50
           C 37 41, 30 34, 20 34
           C 27 26, 25 18, 18 14
           C 28 6, 36 4, 42 6
           L 43 0
           C 45 3, 47 6, 50 10 Z"
        fill="#1e1b4b"
      />
    </svg>
  );
};

// Cute Chibi Batman Silhouette with Pink Heart
export const CuteBatmanChibi: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 96,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="batGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#batGlow)" />

        {/* Batman Cape Silhouette */}
        <path
          d="M 30 55 Q 15 85 24 102 Q 35 95 44 100 Q 52 92 60 97 Q 68 92 76 100 Q 85 95 96 102 Q 105 85 90 55 Z"
          fill="#18181b"
        />

        {/* Batman Body & Head with Cowl Ears */}
        {/* Left Ear */}
        <path d="M 38 42 L 32 15 L 47 30 Z" fill="#27272a" />
        {/* Right Ear */}
        <path d="M 82 42 L 88 15 L 73 30 Z" fill="#27272a" />
        
        {/* Cowl / Head Round */}
        <ellipse cx="60" cy="42" rx="26" ry="24" fill="#27272a" />

        {/* Face opening (cute peach skin) */}
        <path
          d="M 44 45 Q 60 48 76 45 Q 73 60 60 61 Q 47 60 44 45 Z"
          fill="#fed7aa"
        />

        {/* Cute Blushing Cheeks */}
        <circle cx="48" cy="53" r="3" fill="#f43f5e" opacity="0.6" />
        <circle cx="72" cy="53" r="3" fill="#f43f5e" opacity="0.6" />

        {/* Cute Eyes (happy curves or big pupils) */}
        <circle cx="51" cy="48" r="2.5" fill="#18181b" />
        <circle cx="52" cy="47" r="1" fill="#ffffff" />
        <circle cx="69" cy="48" r="2.5" fill="#18181b" />
        <circle cx="70" cy="47" r="1" fill="#ffffff" />

        {/* Sweet Smile */}
        <path d="M 57 54 Q 60 57 63 54" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Body */}
        <path d="M 43 62 Q 60 60 77 62 L 74 86 Q 60 88 46 86 Z" fill="#3f3f46" />

        {/* Yellow utility belt */}
        <rect x="47" y="78" width="26" height="5" rx="2" fill="#fbbf24" />
        <circle cx="60" cy="80.5" r="2.5" fill="#d97706" />

        {/* Chest Batman Insignia */}
        <path
          d="M 60 66 L 63 69 L 68 67 L 66 71 L 63 74 L 60 71 L 57 74 L 54 71 L 52 67 L 57 69 Z"
          fill="#18181b"
        />

        {/* Tiny Pink Bow on Left Ear */}
        <path d="M 33 26 C 30 23, 26 28, 30 30 C 26 32, 30 37, 33 34 Z" fill="#ec4899" />
        <path d="M 37 26 C 40 23, 44 28, 40 30 C 44 32, 40 37, 37 34 Z" fill="#ec4899" />
        <circle cx="35" cy="30" r="2" fill="#f472b6" />
      </svg>
    </div>
  );
};

// Bat Signal Beam Effect
export const BatSignalBeam: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative pointer-events-none select-none ${className}`}>
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-pink-300/25 blur-2xl absolute -top-8 -right-8 animate-pulse" />
      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/70 backdrop-blur-md rounded-full shadow-sm border border-pink-200/80 text-xs text-pink-700 font-medium">
        <BatHeartEmblem size={18} color="#18181b" />
        <span>Bat-Signal: Calling My Special One 💕</span>
      </div>
    </div>
  );
};
