// Sound manager for Tetris game
class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;
  private initialized: boolean = false;

  // Initialize sounds using Web Audio API for generated sounds
  init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;
    
    // Create sounds using AudioContext for simple game sounds
    this.createSounds();
  }

  private createSounds() {
    // We'll generate simple sounds using Web Audio API
  }

  // Helper to create AudioContext (handles browser prefixes)
  private createAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }

  // Play a beep sound using Web Audio API
  private playTone(frequency: number, duration: number, type: OscillatorType = 'square') {
    if (!this.enabled || typeof window === 'undefined') return;

    const audioContext = this.createAudioContext();
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch {
      // Ignore audio errors
    }
  }

  // Play a sequence of notes
  private playNoteSequence(
    frequencies: number[],
    interval: number,
    noteDuration: number,
    oscillatorType: OscillatorType = 'sine'
  ) {
    if (!this.enabled || typeof window === 'undefined') return;
    
    const audioContext = this.createAudioContext();
    if (!audioContext) return;

    try {
      frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = oscillatorType;
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * interval);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + i * interval + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * interval + noteDuration);

        oscillator.start(audioContext.currentTime + i * interval);
        oscillator.stop(audioContext.currentTime + i * interval + noteDuration);
      });
    } catch {
      // Ignore audio errors
    }
  }

  playMove() {
    this.playTone(200, 0.05, 'sine');
  }

  playRotate() {
    this.playTone(300, 0.1, 'sine');
  }

  playDrop() {
    this.playTone(150, 0.15, 'triangle');
  }

  playLineClear() {
    // Play ascending notes for line clear (C4, E4, G4, C5)
    this.playNoteSequence([262, 330, 392, 523], 0.1, 0.2, 'sine');
  }

  playGameOver() {
    // Play descending notes for game over (G4, E4, C4, G3)
    this.playNoteSequence([392, 330, 262, 196], 0.15, 0.3, 'sawtooth');
  }

  playLevelUp() {
    // Play triumphant sound for level up (C5, E5, G5, C6)
    this.playNoteSequence([523, 659, 784, 1047], 0.08, 0.25, 'sine');
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();
