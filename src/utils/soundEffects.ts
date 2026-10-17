/**
 * Web Audio API synthesizer for Ted's adorable retro sound effects & 6 lullabies.
 * Zero external audio files, 100% reliable, zero network latency.
 */

let audioCtx: AudioContext | null = null;
let muted = false;

// Check localStorage for saved sound preference
try {
  const saved = localStorage.getItem('hax_sound_muted');
  if (saved !== null) {
    muted = saved === 'true';
  }
} catch {
  // localStorage may be disabled
}

function getAudioContext(): AudioContext | null {
  if (muted) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export interface LullabySong {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  tempoMs: number;
  waveform: OscillatorType;
  harmonicWaveform: OscillatorType;
  decaySec: number;
  harmonicRatio: number;
  notes: number[];
}

export const LULLABY_COLLECTION: LullabySong[] = [
  {
    id: 'cloudy-cuddles',
    title: 'Cloudy Cuddles',
    icon: '☁️',
    subtitle: 'A slow, floaty, peaceful melody',
    tempoMs: 680,
    waveform: 'sine',
    harmonicWaveform: 'triangle',
    decaySec: 0.75,
    harmonicRatio: 2,
    // Pentatonic float: C5, E5, G5, A5, G5, E5, D5, C5, E5, D5, C5
    notes: [523.25, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33, 523.25, 659.25, 587.33, 523.25, 523.25],
  },
  {
    id: 'sleepy-star',
    title: 'Sleepy Star',
    icon: '⭐',
    subtitle: 'A gentle, magical bell-like melody',
    tempoMs: 460,
    waveform: 'triangle',
    harmonicWaveform: 'sine',
    decaySec: 0.55,
    harmonicRatio: 3,
    // High sparkling bells: G5, B5, D6, B5, C6, G5, E5, G5, D6, C6, B5, G5
    notes: [783.99, 987.77, 1174.66, 987.77, 1046.50, 783.99, 659.25, 783.99, 1174.66, 1046.50, 987.77, 783.99],
  },
  {
    id: 'moonbeam-waltz',
    title: 'Moonbeam Waltz',
    icon: '🌙',
    subtitle: 'A soft melody with a gentle three-beat rhythm',
    tempoMs: 480,
    waveform: 'sine',
    harmonicWaveform: 'triangle',
    decaySec: 0.5,
    harmonicRatio: 1.5,
    // 3/4 waltz rhythm: Down-beat (deep), two light float beats
    notes: [659.25, 783.99, 783.99, 698.46, 880.00, 880.00, 783.99, 987.77, 987.77, 1046.50, 783.99, 659.25],
  },
  {
    id: 'strawberry-dreams',
    title: 'Strawberry Dreams',
    icon: '🍓',
    subtitle: 'A sweet, slightly playful melody',
    tempoMs: 440,
    waveform: 'triangle',
    harmonicWaveform: 'square',
    decaySec: 0.45,
    harmonicRatio: 2,
    // Sweet playful bounce: F5, A5, C6, A5, G5, E5, F5, D5, E5, C5, D5, F5
    notes: [698.46, 880.00, 1046.50, 880.00, 783.99, 659.25, 698.46, 587.33, 659.25, 523.25, 587.33, 698.46],
  },
  {
    id: 'bunny-nap',
    title: "Little Bunny's Nap",
    icon: '🐰',
    subtitle: 'A cozy, slow, repetitive melody',
    tempoMs: 720,
    waveform: 'sine',
    harmonicWaveform: 'sine',
    decaySec: 0.85,
    harmonicRatio: 1,
    // Rocking soothing cradle: D5, G5, F5, D5, C5, E5, D5, G4, D5, E5, C5, D5
    notes: [587.33, 783.99, 698.46, 587.33, 523.25, 659.25, 587.33, 392.00, 587.33, 659.25, 523.25, 587.33],
  },
  {
    id: 'midnight-humming',
    title: 'Midnight Humming',
    icon: '✨',
    subtitle: 'A quiet, minimal melody with softer lower notes',
    tempoMs: 750,
    waveform: 'sine',
    harmonicWaveform: 'triangle',
    decaySec: 0.9,
    harmonicRatio: 0.5,
    // Deep warm bedside hum: C4, G4, A4, E4, F4, G4, E4, C4, F4, D4, C4
    notes: [261.63, 392.00, 440.00, 329.63, 349.23, 392.00, 329.63, 261.63, 349.23, 293.66, 261.63, 261.63],
  },
];

// Lullaby melody player state
let lullabyTimer: ReturnType<typeof setInterval> | null = null;
let currentSongIndex = 0;
let lullabyStep = 0;
let lullabyActive = false;
let lullabyListeners: Array<(isPlaying: boolean, step: number, songId: string) => void> = [];

export const soundManager = {
  isMuted: (): boolean => muted,

  setMuted: (isMuted: boolean): boolean => {
    muted = isMuted;
    try {
      localStorage.setItem('hax_sound_muted', String(isMuted));
    } catch {
      // ignore
    }
    if (muted && lullabyActive) {
      soundManager.stopLullaby();
    }
    return muted;
  },

  toggleMute: (): boolean => {
    return soundManager.setMuted(!muted);
  },

  // Cute bubble pop
  playPop: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  },

  // Sparkly chime
  playChime: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const startTime = ctx.currentTime + index * 0.045;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  },

  // Cheerful spring boing
  playBoing: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.22);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  },

  // Cute celebration fanfare
  playYay: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const time = ctx.currentTime + i * 0.055;
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.14, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.5);
    });
  },

  // Mascot pet / giggle sound
  playGiggle: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = [720, 860, 760, 940, 820];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const time = ctx.currentTime + idx * 0.04;
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.07);
    });
  },

  // Feeding/snack bite sound
  playMunch: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [0, 0.08].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(320 + Math.random() * 80, now + delay);
      osc.frequency.exponentialRampToValueAtTime(180, now + delay + 0.05);

      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.07);
    });
  },

  // Nightlight switch on/off click
  playLightClick: (isOn: boolean) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(isOn ? 650 : 400, now);
    osc.frequency.exponentialRampToValueAtTime(isOn ? 980 : 320, now + 0.06);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  },

  // Single musical note
  playNote: (freq: number, duration = 0.4) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  },

  // Sticker stamp click
  playStickerTap: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  },

  // --- TED'S 6-SONG LULLABY BOX ENGINE ---
  getLullabies: (): LullabySong[] => LULLABY_COLLECTION,

  getCurrentSongId: (): string => LULLABY_COLLECTION[currentSongIndex].id,

  isLullabyPlaying: (): boolean => lullabyActive,

  subscribeLullaby: (fn: (isPlaying: boolean, step: number, songId: string) => void) => {
    lullabyListeners.push(fn);
    return () => {
      lullabyListeners = lullabyListeners.filter(l => l !== fn);
    };
  },

  selectLullaby: (songId: string): boolean => {
    const idx = LULLABY_COLLECTION.findIndex(s => s.id === songId);
    if (idx === -1) return false;

    const wasPlaying = lullabyActive;
    if (wasPlaying) {
      soundManager.stopLullaby();
    }
    currentSongIndex = idx;
    lullabyStep = 0;

    if (wasPlaying) {
      soundManager.startLullaby();
    } else {
      lullabyListeners.forEach(listener => listener(false, 0, LULLABY_COLLECTION[currentSongIndex].id));
    }
    return true;
  },

  startLullaby: (songId?: string) => {
    if (muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    if (songId) {
      const idx = LULLABY_COLLECTION.findIndex(s => s.id === songId);
      if (idx !== -1 && idx !== currentSongIndex) {
        soundManager.stopLullaby();
        currentSongIndex = idx;
        lullabyStep = 0;
      }
    }

    if (lullabyActive) return;
    lullabyActive = true;

    const song = LULLABY_COLLECTION[currentSongIndex];

    const playStep = () => {
      if (!lullabyActive) return;
      const currentSong = LULLABY_COLLECTION[currentSongIndex];
      const freq = currentSong.notes[lullabyStep % currentSong.notes.length];

      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = currentSong.waveform;
      oscHarmonic.type = currentSong.harmonicWaveform;

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(freq, now);
      oscHarmonic.frequency.setValueAtTime(freq * currentSong.harmonicRatio, now);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + currentSong.decaySec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (currentSong.harmonicRatio > 0 && currentSong.harmonicRatio !== 1) {
        const harmonicGain = ctx.createGain();
        harmonicGain.gain.setValueAtTime(0.04, now);
        harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + currentSong.decaySec * 0.7);
        oscHarmonic.connect(harmonicGain);
        harmonicGain.connect(ctx.destination);
        oscHarmonic.start(now);
        oscHarmonic.stop(now + currentSong.decaySec);
      }

      osc.start(now);
      osc.stop(now + currentSong.decaySec);

      lullabyListeners.forEach(listener => listener(true, lullabyStep, currentSong.id));
      lullabyStep++;
    };

    playStep();
    lullabyTimer = setInterval(playStep, song.tempoMs);
  },

  pauseLullaby: () => {
    soundManager.stopLullaby();
  },

  stopLullaby: () => {
    if (lullabyTimer) {
      clearInterval(lullabyTimer);
      lullabyTimer = null;
    }
    lullabyActive = false;
    lullabyListeners.forEach(listener => listener(false, lullabyStep, LULLABY_COLLECTION[currentSongIndex].id));
  },

  toggleLullaby: (songId?: string): boolean => {
    if (lullabyActive) {
      soundManager.stopLullaby();
      return false;
    } else {
      soundManager.startLullaby(songId);
      return true;
    }
  }
};
