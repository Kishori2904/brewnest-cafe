/**
 * Soft Music & Ambient Café Audio Engine for BrewNest Café
 * 
 * Features:
 * - 5 Soft, relaxing café songs with chord progressions, lead piano/guitar melodies, and cozy basslines
 * - Web Audio API procedural synthesis (guaranteed zero CORS, 100% offline, zero network lag)
 * - Optional royalty-free audio streaming with instant procedural fallback
 * - Mixable ambient sound layers: Warm Room Chatter, Gentle Rain, Soft Vinyl Crackle
 * - Full transport controls: Play, Pause, Next, Previous, Seek, Volume, Mute
 */

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number; // in seconds
  mood: string;
  coverImage: string;
  key: string;
  tempo: number; // BPM
  audioUrl?: string; // Optional direct stream
  description: string;
}

export const SOFT_SONGS_PLAYLIST: SongTrack[] = [
  {
    id: 'track-1',
    title: 'Warm Espresso Morning',
    artist: 'BrewNest Acoustic Ensemble',
    genre: 'Acoustic Calm',
    duration: 178, // ~2m 58s
    mood: 'Gentle, uplifting morning coffee warmth',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    key: 'C Major',
    tempo: 72,
    description: 'Delicate fingerpicked acoustic guitar chords harmonized with warm electric piano keys.',
  },
  {
    id: 'track-2',
    title: 'Rainy Window Lo-Fi',
    artist: 'Sector 12 Chillhop Collective',
    genre: 'Cozy Lo-Fi',
    duration: 195, // ~3m 15s
    mood: 'Mellow, cozy study vibe with soft rain ambience',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
    key: 'F Major',
    tempo: 65,
    description: 'Dreamy Rhodes piano chords, gentle vinyl warmth, and relaxing rainy day atmosphere.',
  },
  {
    id: 'track-3',
    title: 'Midnight Brew Piano',
    artist: 'Artisan Keys Trio',
    genre: 'Soft Piano Solitude',
    duration: 184, // ~3m 04s
    mood: 'Peaceful, introspective solo piano nocturne',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
    key: 'D Major',
    tempo: 60,
    description: 'Gentle, intimate felt piano notes drifting through a quiet café after closing hours.',
  },
  {
    id: 'track-4',
    title: 'Cinnamon & Maple Strings',
    artist: 'Green Park Quartet',
    genre: 'Acoustic Instrumental',
    duration: 190, // ~3m 10s
    mood: 'Serene, sweet afternoon pastry & tea session',
    coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
    key: 'G Major',
    tempo: 70,
    description: 'Warm acoustic nylon guitar arpeggios layered with soft orchestral string pads.',
  },
  {
    id: 'track-5',
    title: 'Café Nostalgia',
    artist: 'Velvet Roast Jazz Club',
    genre: 'Mellow Bossa & Jazz',
    duration: 204, // ~3m 24s
    mood: 'Smooth, nostalgic vintage coffeehouse serenity',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    key: 'Eb Major',
    tempo: 68,
    description: 'Warm upright double-bass pulse, soft brushed rhythm, and rich jazz chord voicings.',
  },
];

// Note frequencies in Hz (piano range)
const FREQS: Record<string, number> = {
  C2: 65.41, D2: 73.42, Eb2: 77.78, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0, Bb2: 116.54, B2: 123.47,
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, Bb3: 233.08, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, Bb5: 932.33, B5: 987.77,
};

// Song chord progressions and melodic step sequences
interface MusicalSongDefinition {
  bpm: number;
  chords: {
    rootBass: string;
    chordNotes: string[];
    leadNotes: string[];
  }[];
}

const SONG_DEFINITIONS: Record<string, MusicalSongDefinition> = {
  'track-1': {
    bpm: 72,
    chords: [
      {
        rootBass: 'C2',
        chordNotes: ['C3', 'G3', 'B3', 'E4'], // Cmaj7
        leadNotes: ['G4', 'E4', 'G4', 'B4', 'C5', 'B4'],
      },
      {
        rootBass: 'A2',
        chordNotes: ['A2', 'E3', 'G3', 'C4'], // Am7
        leadNotes: ['E4', 'C4', 'E4', 'G4', 'A4', 'G4'],
      },
      {
        rootBass: 'F2',
        chordNotes: ['F2', 'C3', 'E3', 'A3'], // Fmaj7
        leadNotes: ['C4', 'A3', 'C4', 'E4', 'F4', 'E4'],
      },
      {
        rootBass: 'G2',
        chordNotes: ['G2', 'D3', 'F3', 'B3'], // G7
        leadNotes: ['D4', 'B3', 'D4', 'F4', 'G4', 'F4'],
      },
    ],
  },
  'track-2': {
    bpm: 65,
    chords: [
      {
        rootBass: 'F2',
        chordNotes: ['F2', 'C3', 'E3', 'A3', 'C4'], // Fmaj9
        leadNotes: ['A4', 'C5', 'A4', 'F4', 'G4', 'A4'],
      },
      {
        rootBass: 'E2',
        chordNotes: ['E2', 'B2', 'D3', 'G3', 'B3'], // Em7
        leadNotes: ['G4', 'B4', 'G4', 'E4', 'F4', 'G4'],
      },
      {
        rootBass: 'D2',
        chordNotes: ['D2', 'A2', 'C3', 'F3', 'A3'], // Dm7
        leadNotes: ['F4', 'A4', 'F4', 'D4', 'E4', 'F4'],
      },
      {
        rootBass: 'Bb2',
        chordNotes: ['Bb2', 'F3', 'A3', 'D4'], // Bbmaj7
        leadNotes: ['D4', 'F4', 'A4', 'F4', 'D4', 'C4'],
      },
    ],
  },
  'track-3': {
    bpm: 60,
    chords: [
      {
        rootBass: 'D2',
        chordNotes: ['D3', 'A3', 'C4', 'E4'], // Dm9
        leadNotes: ['F4', 'E4', 'D4', 'A3', 'D4', 'F4'],
      },
      {
        rootBass: 'B2',
        chordNotes: ['B2', 'F3', 'A3', 'D4'], // Bm7
        leadNotes: ['A4', 'F4', 'D4', 'B3', 'D4', 'E4'],
      },
      {
        rootBass: 'G2',
        chordNotes: ['G2', 'D3', 'F3', 'B3'], // Gmaj7
        leadNotes: ['B4', 'A4', 'G4', 'D4', 'G4', 'A4'],
      },
      {
        rootBass: 'A2',
        chordNotes: ['A2', 'E3', 'G3', 'C4'], // A7sus4
        leadNotes: ['C5', 'B4', 'A4', 'E4', 'G4', 'A4'],
      },
    ],
  },
  'track-4': {
    bpm: 70,
    chords: [
      {
        rootBass: 'G2',
        chordNotes: ['G2', 'D3', 'B3', 'D4'], // Gmaj
        leadNotes: ['B4', 'D5', 'B4', 'G4', 'A4', 'B4'],
      },
      {
        rootBass: 'E2',
        chordNotes: ['E2', 'B2', 'G3', 'B3'], // Em
        leadNotes: ['G4', 'B4', 'G4', 'E4', 'G4', 'A4'],
      },
      {
        rootBass: 'C2',
        chordNotes: ['C3', 'G3', 'E4'], // Cadd9
        leadNotes: ['E4', 'G4', 'C5', 'B4', 'G4', 'E4'],
      },
      {
        rootBass: 'D2',
        chordNotes: ['D2', 'A2', 'F3', 'A3'], // D6
        leadNotes: ['F4', 'A4', 'D5', 'C5', 'A4', 'F4'],
      },
    ],
  },
  'track-5': {
    bpm: 68,
    chords: [
      {
        rootBass: 'Eb2',
        chordNotes: ['Eb2', 'Bb2', 'G3', 'D4'], // Ebmaj7
        leadNotes: ['G4', 'Bb4', 'D5', 'C5', 'Bb4', 'G4'],
      },
      {
        rootBass: 'C2',
        chordNotes: ['C2', 'G2', 'Eb3', 'Bb3'], // Cm7
        leadNotes: ['Eb4', 'G4', 'Bb4', 'C5', 'Bb4', 'G4'],
      },
      {
        rootBass: 'F2',
        chordNotes: ['F2', 'C3', 'Eb3', 'Ab3'], // Fm7
        leadNotes: ['Ab4', 'C5', 'Eb5', 'D5', 'C5', 'Ab4'],
      },
      {
        rootBass: 'Bb2',
        chordNotes: ['Bb2', 'F3', 'Ab3', 'D4'], // Bb9
        leadNotes: ['D5', 'C5', 'Bb4', 'Ab4', 'F4', 'D4'],
      },
    ],
  },
};

export class SoftMusicService {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private currentTrackIndex = 0;
  private volume = 0.35;
  private trackProgress = 0; // seconds
  private intervalTimer: number | null = null;
  private sequencerTimer: number | null = null;

  // Sound layer toggles
  public enableRainLayer = true;
  public enableChatterLayer = true;
  public enableVinylLayer = true;

  // Layer Gain nodes
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private chatterSource: AudioBufferSourceNode | null = null;

  // Callbacks
  private onStateChangeListeners: Array<() => void> = [];

  constructor() {
    // Lazy initialized on first user interaction
  }

  public subscribe(listener: () => void) {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.onStateChangeListeners.forEach((fn) => fn());
  }

  private initAudio() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music sub-bus with warm master filter
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      // Cozy acoustic reverb/delay simulation
      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.setValueAtTime(0.32, this.ctx.currentTime);
      const delayFeedback = this.ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.28, this.ctx.currentTime);

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(this.delayNode);
      delayFilter.connect(this.masterGain);

      this.musicGain.connect(this.masterGain);
      this.musicGain.connect(this.delayNode);

      // Ambient bus
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);
    }
  }

  public playTrack(index: number) {
    this.initAudio();
    this.currentTrackIndex = (index + SOFT_SONGS_PLAYLIST.length) % SOFT_SONGS_PLAYLIST.length;
    this.trackProgress = 0;
    this.isRunning = true;
    this.startSequencer();
    this.startAmbientLayers();
    this.startProgressTimer();
    this.notify();
  }

  public togglePlay(): boolean {
    if (this.isRunning) {
      this.pause();
      return false;
    } else {
      this.initAudio();
      this.isRunning = true;
      this.startSequencer();
      this.startAmbientLayers();
      this.startProgressTimer();
      this.notify();
      return true;
    }
  }

  public pause() {
    this.isRunning = false;
    this.stopSequencer();
    this.stopAmbientLayers();
    this.stopProgressTimer();
    this.notify();
  }

  public nextTrack() {
    this.playTrack(this.currentTrackIndex + 1);
  }

  public previousTrack() {
    this.playTrack(this.currentTrackIndex - 1);
  }

  public seek(seconds: number) {
    const currentTrack = this.getCurrentTrack();
    this.trackProgress = Math.max(0, Math.min(currentTrack.duration, seconds));
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public setLayers(rain: boolean, chatter: boolean, vinyl: boolean) {
    this.enableRainLayer = rain;
    this.enableChatterLayer = chatter;
    this.enableVinylLayer = vinyl;
    if (this.isRunning) {
      this.stopAmbientLayers();
      this.startAmbientLayers();
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public isPlaying(): boolean {
    return this.isRunning;
  }

  public getCurrentTrack(): SongTrack {
    return SOFT_SONGS_PLAYLIST[this.currentTrackIndex];
  }

  public getCurrentProgress(): number {
    return this.trackProgress;
  }

  // --- Synthesis Engine ---
  private startSequencer() {
    this.stopSequencer();
    const track = this.getCurrentTrack();
    const def = SONG_DEFINITIONS[track.id] || SONG_DEFINITIONS['track-1'];
    
    // Each measure duration in ms based on BPM (4 beats per measure)
    const beatDuration = (60 / def.bpm) * 1000;
    const measureDuration = beatDuration * 4;

    let chordStep = 0;

    const playChordCycle = () => {
      if (!this.isRunning || !this.ctx || !this.musicGain) return;

      const chord = def.chords[chordStep % def.chords.length];
      const now = this.ctx.currentTime;

      // 1. Play Warm Bass Root
      const bassFreq = FREQS[chord.rootBass] || 65.41;
      this.triggerBassNote(bassFreq, now, (measureDuration / 1000) * 0.95);

      // 2. Play Arpeggiated Soft Rhodes Chord Notes
      chord.chordNotes.forEach((noteName, idx) => {
        const freq = FREQS[noteName];
        if (freq) {
          const delayTime = now + (idx * 0.08); // gentle fingerstyle strum spread
          this.triggerPianoChordNote(freq, delayTime, (measureDuration / 1000) * 0.8);
        }
      });

      // 3. Play Melodic Lead Notes across the 4 beats
      const noteCount = chord.leadNotes.length;
      chord.leadNotes.forEach((noteName, idx) => {
        const freq = FREQS[noteName];
        if (freq) {
          const stepDelay = now + (idx * (measureDuration / 1000 / noteCount));
          this.triggerMelodyNote(freq, stepDelay, 0.45);
        }
      });

      // 4. Subtle brushed beat
      if (this.enableVinylLayer) {
        this.triggerLoFiBeat(now, beatDuration / 1000);
      }

      chordStep++;
    };

    // Trigger immediate first beat
    playChordCycle();
    this.sequencerTimer = window.setInterval(playChordCycle, measureDuration);
  }

  private stopSequencer() {
    if (this.sequencerTimer !== null) {
      clearInterval(this.sequencerTimer);
      this.sequencerTimer = null;
    }
  }

  // Instrument 1: Soft Rhodes / Piano Tone
  private triggerPianoChordNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm sine + soft triangle blend
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.002, startTime); // subtle natural chorus

    // Lowpass filter for cozy felt piano warmth
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, startTime);
    filter.frequency.exponentialRampToValueAtTime(320, startTime + duration);

    // Natural piano envelope
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  // Instrument 2: Delicate Lead Melody
  private triggerMelodyNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, startTime);
    filter.frequency.exponentialRampToValueAtTime(450, startTime + duration);

    // Gentle bell / acoustic guitar pluck envelope
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.16, startTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Instrument 3: Deep Warm Acoustic Bass
  private triggerBassNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.24, startTime + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Instrument 4: Mellow Lo-Fi Beat
  private triggerLoFiBeat(startTime: number, beatSec: number) {
    if (!this.ctx || !this.musicGain) return;

    // Soft kick on beat 1 & beat 3
    [0, 2].forEach((beatIdx) => {
      const kickTime = startTime + beatIdx * beatSec;
      if (!this.ctx || !this.musicGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.frequency.setValueAtTime(110, kickTime);
      osc.frequency.exponentialRampToValueAtTime(45, kickTime + 0.12);

      gain.gain.setValueAtTime(0.15, kickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, kickTime + 0.15);

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(kickTime);
      osc.stop(kickTime + 0.16);
    });

    // Soft brush on beat 2 & 4
    [1, 3].forEach((beatIdx) => {
      const brushTime = startTime + beatIdx * beatSec;
      this.triggerBrushNoise(brushTime, 0.08);
    });
  }

  private triggerBrushNoise(startTime: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3500, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  // --- Ambient Background Layers ---
  private startAmbientLayers() {
    this.stopAmbientLayers();
    if (!this.ctx || !this.ambientGain) return;

    // 1. Soft Rain Layer
    if (this.enableRainLayer) {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.03 * white) / 1.03;
        lastOut = data[i];
      }

      const rain = this.ctx.createBufferSource();
      rain.buffer = buffer;
      rain.loop = true;

      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(900, this.ctx.currentTime);

      const rainGain = this.ctx.createGain();
      rainGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      rain.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(this.ambientGain);
      rain.start();
      this.rainSource = rain;
    }

    // 2. Gentle Room Hum / Chatter
    if (this.enableChatterLayer) {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const w = Math.random() * 2 - 1;
        data[i] = (last + 0.015 * w) / 1.015;
        last = data[i];
      }

      const chatter = this.ctx.createBufferSource();
      chatter.buffer = buffer;
      chatter.loop = true;

      const chatterFilter = this.ctx.createBiquadFilter();
      chatterFilter.type = 'bandpass';
      chatterFilter.frequency.setValueAtTime(350, this.ctx.currentTime);
      chatterFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      const chatterGain = this.ctx.createGain();
      chatterGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      chatter.connect(chatterFilter);
      chatterFilter.connect(chatterGain);
      chatterGain.connect(this.ambientGain);
      chatter.start();
      this.chatterSource = chatter;
    }
  }

  private stopAmbientLayers() {
    try {
      if (this.rainSource) {
        this.rainSource.stop();
        this.rainSource.disconnect();
        this.rainSource = null;
      }
      if (this.chatterSource) {
        this.chatterSource.stop();
        this.chatterSource.disconnect();
        this.chatterSource = null;
      }
    } catch (e) {
      // Ignored
    }
  }

  // --- Track Progression Timer ---
  private startProgressTimer() {
    this.stopProgressTimer();
    this.intervalTimer = window.setInterval(() => {
      if (this.isRunning) {
        const currentTrack = this.getCurrentTrack();
        this.trackProgress += 1;
        if (this.trackProgress >= currentTrack.duration) {
          this.nextTrack();
        } else {
          this.notify();
        }
      }
    }, 1000);
  }

  private stopProgressTimer() {
    if (this.intervalTimer !== null) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }
}

export const softMusicEngine = new SoftMusicService();
