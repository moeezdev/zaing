export interface PhotoMemory {
  id: string;
  url: string;
  caption: string;
  date?: string;
  rotation?: number;
}

const STORAGE_KEY = 'romantic_birthday_photos_v2';
const HERO_PHOTO_KEY = 'romantic_birthday_hero_photo_v2';

// Basic initial romantic memories loaded from /zaiiin/images/ and /photos/ folder
export const DEFAULT_MEMORIES: PhotoMemory[] = [
  {
    id: 'basic-photo-1',
    url: '/zaiiin/images/photo1.jpg',
    caption: 'My favorite smile & my handsome Batman 🦇🌹',
    date: 'Forever & Always',
    rotation: -2,
  },
  {
    id: 'basic-photo-2',
    url: '/zaiiin/images/photo2.jpg',
    caption: 'The warmest hugs in Gotham City 💕',
    date: 'Favorite Memory',
    rotation: 2.5,
  },
  {
    id: 'basic-photo-3',
    url: '/zaiiin/images/photo3.jpg',
    caption: 'Happy Birthday to my favorite human 🎂💗',
    date: 'Birthday Boy',
    rotation: -1.5,
  },
  {
    id: 'basic-photo-4',
    url: '/zaiiin/images/photo4.jpg',
    caption: 'You stole my heart and kept it safe 💌',
    date: 'Forever Love',
    rotation: 1.8,
  },
];

export const getSavedPhotos = (): PhotoMemory[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read photos from storage', e);
  }
  return DEFAULT_MEMORIES;
};

export const savePhotos = (photos: PhotoMemory[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (e) {
    console.error('Failed to save photos', e);
  }
};

export const resetToDefaultPhotos = (): PhotoMemory[] => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return DEFAULT_MEMORIES;
};

export const getHeroPhoto = (): string | null => {
  try {
    const custom = localStorage.getItem(HERO_PHOTO_KEY);
    if (custom) return custom;
  } catch {}
  return '/zaiiin/images/photo1.jpg';
};

export const saveHeroPhoto = (url: string | null): void => {
  try {
    if (url) {
      localStorage.setItem(HERO_PHOTO_KEY, url);
    } else {
      localStorage.removeItem(HERO_PHOTO_KEY);
    }
  } catch (e) {
    console.error('Failed to save hero photo', e);
  }
};
