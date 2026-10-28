/**
 * Audio synthesis & custom song playback utility.
 * Supports:
 * 1. Custom songs (uploaded MP3 / direct URL / /song.mp3 in public folder)
 * 2. Dreamy romantic lullaby synthesizer (Web Audio API fallback)
 * 3. Cute romantic sound effects (chimes, pops, playful dodges)
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmInterval: number | null = null;
  private masterGain: GainNode | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private customSongUrl: string | null = null;
  private customSongName: string = 'Dreamy Lullaby (Default)';
  private volume: number = 0.65;

  constructor() {
    // Restore saved custom song if available
    try {
      const savedUrl = localStorage.getItem('romantic_custom_song_url');
      const savedName = localStorage.getItem('romantic_custom_song_name');
      if (savedUrl) {
        this.customSongUrl = savedUrl;
        this.customSongName = savedName || 'My Custom Song 🎶';
        this.setupCustomAudio(savedUrl);
      } else {
        // Automatically check the /zaiiin/song/ and /public/song/ folders for opus and mp3 files
        const potentialSongPaths = [
          '/zaiiin/song/song.opus',
          '/zaiiin/song/music.opus',
          '/zaiiin/song/birthday.opus',
          '/zaiiin/song/audio.opus',
          '/zaiiin/song/song.mp3',
          '/zaiiin/song/music.mp3',
          '/song/song.opus',
          '/song/music.opus',
          '/song/song.mp3',
          '/song/music.mp3',
          '/song/birthday.opus',
          '/song/birthday.mp3',
          '/song.opus',
          '/song.mp3',
        ];

        const tryFindSong = async () => {
          for (const path of potentialSongPaths) {
            try {
              const res = await fetch(path, { method: 'HEAD' });
              if (
                res.ok &&
                (res.headers.get('content-type')?.includes('audio') ||
                  res.headers.get('content-type')?.includes('ogg') ||
                  path.endsWith('.opus') ||
                  path.endsWith('.mp3') ||
                  path.endsWith('.ogg'))
              ) {
                this.setCustomSong(path, `${path.split('/').pop()} (from ${path})`);
                break;
              }
            } catch {}
          }
        };

        tryFindSong();
      }
    } catch {
      // Storage access handled
    }
  }

  private setupCustomAudio(url: string) {
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = this.volume;
    this.customAudio = audio;
  }

  public setCustomSong(url: string, name: string = 'Custom Love Song 🎵') {
    this.customSongUrl = url;
    this.customSongName = name;
    try {
      localStorage.setItem('romantic_custom_song_url', url);
      localStorage.setItem('romantic_custom_song_name', name);
    } catch (e) {
      console.warn('Failed to save song to localStorage', e);
    }

    const wasPlaying = this.isBgmPlaying;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }

    this.setupCustomAudio(url);

    if (wasPlaying) {
      this.customAudio?.play().catch(() => {});
    }
  }

  public resetToDefaultSong() {
    try {
      localStorage.removeItem('romantic_custom_song_url');
      localStorage.removeItem('romantic_custom_song_name');
    } catch {}

    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    this.customSongUrl = null;
    this.customSongName = 'Dreamy Lullaby (Default)';

    if (this.isBgmPlaying) {
      this.startSynthesizedBgm();
    }
  }

  public getCustomSongName(): string {
    return this.customSongName;
  }

  public isUsingCustomSong(): boolean {
    return !!this.customSongUrl;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private melodyNotes = [
    261.63, 329.63, 392.00, 493.88, 523.25, 659.25,
    587.33, 493.88, 440.00, 349.23, 392.00, 523.25,
  ];
  private currentMelodyIndex = 0;

  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm() {
    this.isBgmPlaying = true;

    // If custom audio exists, play it
    if (this.customSongUrl && this.customAudio) {
      this.customAudio.play().catch(() => {
        // Fallback to synth if autoplay block
        this.startSynthesizedBgm();
      });
      return;
    }

    this.startSynthesizedBgm();
  }

  private startSynthesizedBgm() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const playNextChord = () => {
        if (!this.isBgmPlaying || !this.ctx || !this.masterGain || this.isMuted) return;

        const baseFreq = this.melodyNotes[this.currentMelodyIndex % this.melodyNotes.length];
        this.currentMelodyIndex++;

        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.08, now + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.3);

        if (Math.random() > 0.4) {
          const osc2 = this.ctx.createOscillator();
          const noteGain2 = this.ctx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(baseFreq * 1.5, now + 0.15);

          noteGain2.gain.setValueAtTime(0, now + 0.15);
          noteGain2.gain.linearRampToValueAtTime(0.03, now + 0.25);
          noteGain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

          osc2.connect(noteGain2);
          noteGain2.connect(this.masterGain);

          osc2.start(now + 0.15);
          osc2.stop(now + 1.9);
        }
      };

      if (!this.bgmInterval) {
        playNextChord();
        this.bgmInterval = window.setInterval(playNextChord, 1200);
      }
    } catch {
      // AudioContext policy handled
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public playChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.0);
      });
    } catch {}
  }

  public playPop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(170, now + 0.25);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.31);
    } catch {}
  }

  public playDodge() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + Math.random() * 200, now);
      osc.frequency.linearRampToValueAtTime(600 + Math.random() * 300, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  public playSparkle() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }
}

export const sound = new SoundController();
