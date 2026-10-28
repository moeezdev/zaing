import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Plus, Trash2, Edit2, Check, Sparkles, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { PhotoMemory, getSavedPhotos, savePhotos, resetToDefaultPhotos } from '../utils/photoStorage';
import { BatHeartEmblem } from './BatmanDetails';
import { sound } from '../utils/sound';

interface PhotoMemoriesProps {
  className?: string;
}

export const PhotoMemories: React.FC<PhotoMemoriesProps> = ({ className = '' }) => {
  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(getSavedPhotos());
  }, []);

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        sound.playPop();
        const newPhoto: PhotoMemory = {
          id: `photo-${Date.now()}`,
          url: dataUrl,
          caption: 'My favorite person in the whole universe 🦇💗',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          rotation: Math.floor(Math.random() * 8 - 4),
        };

        const updated = [newPhoto, ...photos];
        setPhotos(updated);
        savePhotos(updated);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    sound.playWrong();
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    savePhotos(updated);
  };

  const handleStartEdit = (photo: PhotoMemory) => {
    setEditingId(photo.id);
    setEditingCaption(photo.caption);
  };

  const handleSaveCaption = (id: string) => {
    sound.playSparkle();
    const updated = photos.map((p) =>
      p.id === id ? { ...p, caption: editingCaption.trim() || 'My Batman 💗' } : p
    );
    setPhotos(updated);
    savePhotos(updated);
    setEditingId(null);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto my-8 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 px-2">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <BatHeartEmblem size={22} color="#18181b" />
            <h3 className="text-xl sm:text-2xl font-display font-bold text-pink-950">
              Our Memory Gallery 📸💕
            </h3>
          </div>
          <p className="text-xs text-pink-700/80 mt-0.5">
            Polaroid moments of my favorite human
          </p>
        </div>

        {/* Upload & Reset Buttons */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadPhoto}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-xs font-semibold shadow-md shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Add His Photo 📸</span>
          </button>
          <button
            onClick={() => {
              const res = resetToDefaultPhotos();
              setPhotos(res);
              sound.playSparkle();
            }}
            title="Reset to photos from /public/photos/ folder"
            className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Polaroid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
        <AnimatePresence>
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white rounded-2xl p-3 pb-5 shadow-xl shadow-pink-200/50 border border-pink-100 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] group"
              style={{
                transform: `rotate(${photo.rotation || 0}deg)`,
              }}
            >
              {/* Cute Washi Tape Decor on Top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/80 backdrop-blur-xs rounded-sm rotate-[-2deg] shadow-xs pointer-events-none border-t border-b border-pink-300/40" />

              {/* Photo Frame */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-pink-50 mb-3 border border-pink-100/80">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle bat icon badge on photo corner */}
                <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md rounded-full p-1 shadow-sm">
                  <BatHeartEmblem size={16} color="#ffffff" />
                </div>

                {/* Hover Action Buttons */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleStartEdit(photo)}
                    title="Edit Caption"
                    className="p-1.5 bg-white/90 hover:bg-white text-zinc-700 rounded-full shadow-sm hover:text-pink-600 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    title="Remove Photo"
                    className="p-1.5 bg-white/90 hover:bg-white text-rose-500 rounded-full shadow-sm hover:text-rose-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Polaroid Caption */}
              <div className="px-1 text-center">
                {editingId === photo.id ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="text"
                      value={editingCaption}
                      onChange={(e) => setEditingCaption(e.target.value)}
                      placeholder="Write cute caption..."
                      maxLength={80}
                      className="flex-1 px-2 py-1 text-xs bg-pink-50 border border-pink-300 rounded-lg text-pink-950 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveCaption(photo.id)}
                      className="p-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs sm:text-sm font-script text-pink-900 leading-tight">
                      "{photo.caption}"
                    </p>
                    {photo.date && (
                      <span className="text-[10px] text-pink-400 block mt-1 font-mono">
                        {photo.date}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Quick Add Placeholder Card */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-2xl border-2 border-dashed border-pink-300 hover:border-pink-500 bg-pink-50/40 hover:bg-pink-100/50 flex flex-col items-center justify-center p-6 text-pink-600 hover:text-pink-800 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform mb-3 border border-pink-200">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold">Add Another Photo Of Him 📸</span>
          <span className="text-[11px] text-pink-400 mt-1">PNG, JPG, or from phone camera</span>
        </button>
      </div>
    </div>
  );
};
