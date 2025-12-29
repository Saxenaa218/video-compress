// Simple sound effects using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch {
        console.warn('Web Audio API not supported');
        return null;
      }
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.1): void {
    if (this.isMuted) return;
    
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  playChomp(): void {
    this.playTone(440, 0.05, 'square', 0.05);
    setTimeout(() => this.playTone(523, 0.05, 'square', 0.05), 50);
  }

  playPowerPellet(): void {
    this.playTone(660, 0.1, 'sine', 0.1);
    setTimeout(() => this.playTone(880, 0.1, 'sine', 0.1), 100);
    setTimeout(() => this.playTone(1100, 0.15, 'sine', 0.1), 200);
  }

  playGhostEaten(): void {
    this.playTone(330, 0.1, 'sawtooth', 0.1);
    setTimeout(() => this.playTone(440, 0.1, 'sawtooth', 0.1), 100);
    setTimeout(() => this.playTone(660, 0.2, 'sawtooth', 0.1), 200);
  }

  playDeath(): void {
    const notes = [440, 415, 392, 370, 349, 330, 311, 293];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.15), i * 100);
    });
  }

  playLevelUp(): void {
    const notes = [523, 659, 784, 1046];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.15), i * 100);
    });
  }

  playGameOver(): void {
    const notes = [392, 349, 330, 262];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.2), i * 200);
    });
  }

  playStart(): void {
    const notes = [262, 330, 392, 523];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.1, 'sine', 0.1), i * 75);
    });
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  getMuteState(): boolean {
    return this.isMuted;
  }
}

// Singleton instance
export const soundManager = typeof window !== 'undefined' ? new SoundManager() : null;
