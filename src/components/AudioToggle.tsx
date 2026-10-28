import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Sparkles, Upload, RotateCcw, X, Sliders, Check } from 'lucide-react';
import { sound } from '../utils/sound';

interface AudioToggleProps {
  currentStep: number;
  totalSteps: number;
  onJumpStep?: (step: number) => void;
}

export const AudioToggle: React.FC<AudioToggleProps> = ({ currentStep, totalSteps, onJumpStep }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showNav, setShowNav] = useState<boolean>(false);
  const [showMusicModal, setShowMusicModal] = useState<boolean>(false);
  const [songTitle, setSongTitle] = useState<string>('Dreamy Lullaby (Default)');
  const [volume, setVolume] = useState<number>(0.65);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsPlaying(sound.getIsBgmPlaying());
    setSongTitle(sound.getCustomSongName());
    setVolume(sound.getVolume());
  }, []);

  const handleToggle = () => {
    const active = sound.toggleBgm();
    setIsPlaying(active);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        sound.setCustomSong(dataUrl, fileName);
        setSongTitle(fileName);
        setIsPlaying(true);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    sound.setCustomSong(customUrlInput.trim(), 'Custom Song Link 🎶');
    setSongTitle('Custom Song Link 🎶');
    setIsPlaying(true);
    setCustomUrlInput('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleResetDefault = () => {
    sound.resetToDefaultSong();
    setSongTitle('Dreamy Lullaby (Default)');
    setIsPlaying(sound.getIsBgmPlaying());
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setVolume(val);
  };

  const stepNames = [
    'Secret Lock',
    'Love Check',
    'Love You More',
    'Love Explosion',
    'Text Heart',
    'Birthday Letter',
  ];

  return (
    <header className="fixed top-4 right-4 z-50 flex items-center gap-2 select-none">
      {/* Chapter Indicator / Quick Jump */}
      <div className="relative">
        <button
          onClick={() => {
            setShowNav(!showNav);
            setShowMusicModal(false);
          }}
          title="Chapters"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/85 hover:bg-white backdrop-blur-md rounded-full shadow-sm border border-pink-200/80 text-xs font-medium text-pink-700 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Part {currentStep}/{totalSteps}</span>
        </button>

        {showNav && (
          <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-200 p-2 text-xs flex flex-col gap-1 z-50">
            <div className="px-2 py-1 font-semibold text-pink-900 border-b border-pink-100 flex items-center justify-between">
              <span>Our Story Chapters</span>
              <span className="text-[10px] text-pink-400">Jump to</span>
            </div>
            {stepNames.map((name, idx) => {
              const stepNum = idx + 1;
              const isCurrent = stepNum === currentStep;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onJumpStep?.(stepNum);
                    setShowNav(false);
                    sound.playSparkle();
                  }}
                  className={`text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-pink-100 text-pink-800 font-semibold'
                      : 'text-slate-600 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  <span>{stepNum}. {name}</span>
                  {isCurrent && <span className="text-pink-500">💗</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Romantic Music Toggle Button */}
      <div className="flex items-center gap-1 bg-white/85 backdrop-blur-md rounded-full shadow-sm border border-pink-200/80 p-0.5">
        <button
          onClick={handleToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
            isPlaying
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
              : 'text-pink-700 hover:bg-pink-50'
          }`}
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <>
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 bg-white h-3 animate-pulse" />
                <span className="w-0.5 bg-white h-2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-0.5 bg-white h-3.5 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <Volume2 className="w-3.5 h-3.5" />
              <span className="text-xs font-medium max-w-[90px] sm:max-w-[120px] truncate">
                {songTitle}
              </span>
            </>
          ) : (
            <>
              <Music className="w-3.5 h-3.5 text-pink-500" />
              <VolumeX className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-xs font-medium">Music Off</span>
            </>
          )}
        </button>

        {/* Music Settings Cog / Change Song Button */}
        <button
          onClick={() => {
            setShowMusicModal(!showMusicModal);
            setShowNav(false);
          }}
          className="p-1.5 text-pink-600 hover:text-pink-900 hover:bg-pink-100/70 rounded-full transition-colors cursor-pointer"
          title="Change Song / Music Settings 🎵"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Music Customization Modal / Drawer */}
      {showMusicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-pink-200 p-6 w-full max-w-md text-left relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowMusicModal(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-pink-50 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-pink-950 font-display">Change Music 🎵</h3>
                <p className="text-xs text-pink-700">Choose any song you want to play in the background</p>
              </div>
            </div>

            {uploadSuccess && (
              <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Your custom song is now playing! 🎶</span>
              </div>
            )}

            {/* Currently Playing Track */}
            <div className="p-3 bg-pink-50/70 rounded-2xl border border-pink-200 mb-4">
              <span className="text-[11px] font-semibold text-pink-600 uppercase tracking-wider block mb-1">
                Currently Playing
              </span>
              <p className="text-sm font-bold text-pink-950 flex items-center gap-2">
                <span>🎼</span>
                <span className="truncate">{songTitle}</span>
              </p>
            </div>

            {/* Option 1: Upload Song File */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Option 1: Upload Your Favorite Song (OPUS / MP3 / M4A / WAV)
              </label>
              <p className="text-[11px] text-pink-600 mb-2">
                Supports .opus, .mp3, .m4a, and audio files from your device
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*, .opus, .ogg, .mp3, .m4a, .wav, audio/ogg, audio/webm, audio/opus"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-pink-300 hover:border-pink-500 bg-pink-50/50 hover:bg-pink-100/50 text-pink-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Audio File (.opus, .mp3, etc.)</span>
              </button>
            </div>

            {/* Option 2: Song Link / URL */}
            <form onSubmit={handleApplyUrl} className="mb-4">
              <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                Option 2: Paste Direct Audio Link / URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/song.mp3"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-zinc-50 border border-pink-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Play
                </button>
              </div>
            </form>

            {/* Volume Slider */}
            <div className="mb-4 pt-2 border-t border-pink-100">
              <div className="flex items-center justify-between text-xs text-zinc-700 mb-1">
                <span className="font-medium">Music Volume</span>
                <span className="font-mono text-pink-600">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* Reset to Default */}
            <div className="flex items-center justify-between pt-2 border-t border-pink-100">
              <button
                onClick={handleResetDefault}
                className="text-xs text-pink-600 hover:text-pink-800 font-medium flex items-center gap-1.5 underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Dreamy Lullaby</span>
              </button>
              <button
                onClick={() => setShowMusicModal(false)}
                className="px-4 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
