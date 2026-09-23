/**
 * Procedural Ambient Audio Generator for BrewNest Café
 * Uses the Web Audio API to create a cozy, warm acoustic café hum.
 * Zero external audio assets required; runs 100% client-side and offline.
 */

class CafeAmbianceService {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private running = false;
  private currentVolume = 0.25;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start(): boolean {
    try {
      this.initContext();
      if (!this.ctx) return false;

      // Stop any existing sounds
      this.stop();

      // Buffer size for noise
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate soft brown noise (gentle warm room acoustic rumble)
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain compensation
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Lowpass filter to simulate muffled café interior warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      // Subtle LFO modulation to simulate shifting room air and espresso steam
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // very slow breathing
      lfoGain.gain.setValueAtTime(90, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      // Master gain node
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);

      // Connect pipeline
      noiseSource.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      noiseSource.start();

      this.noiseNode = noiseSource;
      this.filterNode = filter;
      this.lfoNode = lfo;
      this.gainNode = masterGain;
      this.running = true;
      return true;
    } catch (e) {
      console.warn('Web Audio Ambiance not initialized:', e);
      return false;
    }
  }

  public stop() {
    try {
      if (this.noiseNode && 'stop' in this.noiseNode) {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
      }
      if (this.lfoNode) {
        this.lfoNode.stop();
        this.lfoNode.disconnect();
      }
      this.noiseNode = null;
      this.filterNode = null;
      this.lfoNode = null;
      this.running = false;
    } catch (e) {
      // Ignored
    }
  }

  public toggle(): boolean {
    if (this.running) {
      this.stop();
      return false;
    } else {
      return this.start();
    }
  }

  public isPlaying(): boolean {
    return this.running;
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.currentVolume;
  }
}

export const cafeAmbiance = new CafeAmbianceService();
