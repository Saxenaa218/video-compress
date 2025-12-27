'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';

interface AudioEditorProps {
  audioFile: File;
  onBack: () => void;
}

interface Region {
  id: string;
  start: number;
  end: number;
  remove: () => void;
}

export default function AudioEditor({ audioFile, onBack }: AudioEditorProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const activeRegionRef = useRef<Region | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [regionStart, setRegionStart] = useState(0);
  const [regionEnd, setRegionEnd] = useState(0);
  const [hasRegion, setHasRegion] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    const regions = RegionsPlugin.create();
    regionsRef.current = regions;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4F46E5',
      progressColor: '#818CF8',
      cursorColor: '#1E1B4B',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 128,
      normalize: true,
      plugins: [regions],
    });

    wavesurferRef.current = wavesurfer;

    const audioUrl = URL.createObjectURL(audioFile);
    wavesurfer.load(audioUrl);

    wavesurfer.on('ready', () => {
      setDuration(wavesurfer.getDuration());
      setIsLoading(false);
    });

    wavesurfer.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('seeking', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));
    wavesurfer.on('finish', () => setIsPlaying(false));

    regions.on('region-created', (region: Region) => {
      if (activeRegionRef.current && activeRegionRef.current.id !== region.id) {
        activeRegionRef.current.remove();
      }
      activeRegionRef.current = region;
      setRegionStart(region.start);
      setRegionEnd(region.end);
      setHasRegion(true);
    });

    regions.on('region-updated', (region: Region) => {
      setRegionStart(region.start);
      setRegionEnd(region.end);
    });

    return () => {
      URL.revokeObjectURL(audioUrl);
      wavesurfer.destroy();
    };
  }, [audioFile]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    wavesurferRef.current?.playPause();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    wavesurferRef.current?.setVolume(newVolume);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    wavesurferRef.current?.setPlaybackRate(rate);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    wavesurferRef.current?.seekTo(time / duration);
  };

  const createRegion = useCallback(() => {
    if (!regionsRef.current || !wavesurferRef.current) return;
    
    const currentDuration = wavesurferRef.current.getDuration();
    const start = currentDuration * 0.25;
    const end = currentDuration * 0.75;

    regionsRef.current.addRegion({
      start,
      end,
      color: 'rgba(79, 70, 229, 0.3)',
      drag: true,
      resize: true,
    });
  }, []);

  const clearRegion = () => {
    if (activeRegionRef.current) {
      activeRegionRef.current.remove();
      activeRegionRef.current = null;
      setHasRegion(false);
      setRegionStart(0);
      setRegionEnd(0);
    }
  };

  const playRegion = () => {
    if (wavesurferRef.current && activeRegionRef.current) {
      wavesurferRef.current.seekTo(activeRegionRef.current.start / duration);
      wavesurferRef.current.play();
    }
  };

  const trimToRegion = async () => {
    if (!activeRegionRef.current || !wavesurferRef.current) return;

    const start = activeRegionRef.current.start;
    const end = activeRegionRef.current.end;

    let audioContext: AudioContext | null = null;
    try {
      audioContext = new AudioContext();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const startSample = Math.floor(start * audioBuffer.sampleRate);
      const endSample = Math.floor(end * audioBuffer.sampleRate);
      const trimmedLength = endSample - startSample;

      const trimmedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        trimmedLength,
        audioBuffer.sampleRate
      );

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const sourceData = audioBuffer.getChannelData(channel);
        const destData = trimmedBuffer.getChannelData(channel);
        for (let i = 0; i < trimmedLength; i++) {
          destData[i] = sourceData[startSample + i];
        }
      }

      const wavBlob = audioBufferToWav(trimmedBuffer);
      downloadBlob(wavBlob, `trimmed_${audioFile.name.replace(/\.[^/.]+$/, '')}.wav`);
    } catch (error) {
      console.error('Error trimming audio:', error);
      alert('Failed to trim audio. Please try again.');
    } finally {
      if (audioContext) {
        await audioContext.close();
      }
    }
  };

  // WAV file format constants
  const WAV_RIFF_HEADER = 0x46464952; // "RIFF" in little-endian
  const WAV_WAVE_HEADER = 0x45564157; // "WAVE" in little-endian
  const WAV_FMT_CHUNK = 0x20746d66;   // "fmt " in little-endian
  const WAV_DATA_CHUNK = 0x61746164;  // "data" in little-endian

  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    const channels: Float32Array[] = [];
    let offset = 0;
    let pos = 0;

    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };

    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    // RIFF header
    setUint32(WAV_RIFF_HEADER);
    setUint32(length - 8);
    setUint32(WAV_WAVE_HEADER);

    // fmt chunk
    setUint32(WAV_FMT_CHUNK);
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);

    // data chunk
    setUint32(WAV_DATA_CHUNK);
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (offset < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([bufferArray], { type: 'audio/wav' });
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const skipBackward = () => {
    if (wavesurferRef.current) {
      const newTime = Math.max(0, wavesurferRef.current.getCurrentTime() - 5);
      wavesurferRef.current.seekTo(newTime / duration);
    }
  };

  const skipForward = () => {
    if (wavesurferRef.current) {
      const newTime = Math.min(duration, wavesurferRef.current.getCurrentTime() + 5);
      wavesurferRef.current.seekTo(newTime / duration);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 truncate max-w-md">
          {audioFile.name}
        </h2>
        <div className="w-16" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        <div ref={waveformRef} className={`w-full ${isLoading ? 'hidden' : ''}`} />

        <div className="flex items-center gap-4">
          <span className="text-sm font-mono text-gray-600 dark:text-gray-400 w-24">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-sm font-mono text-gray-600 dark:text-gray-400 w-24 text-right">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={skipBackward}
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Skip backward 5s"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>

          <button
            onClick={togglePlayPause}
            className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={skipForward}
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Skip forward 5s"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414M2.808 18.364a9 9 0 001.414 1.414" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-10">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
              <button
                key={rate}
                onClick={() => handlePlaybackRateChange(rate)}
                className={`px-2 py-1 text-xs rounded ${
                  playbackRate === rate
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-colors`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Editing Tools
        </h3>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={createRegion}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16M4 12h16" />
            </svg>
            Create Selection
          </button>

          {hasRegion && (
            <>
              <button
                onClick={playRegion}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Selection
              </button>

              <button
                onClick={trimToRegion}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                </svg>
                Trim & Download
              </button>

              <button
                onClick={clearRegion}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Selection
              </button>
            </>
          )}
        </div>

        {hasRegion && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Start:</span>
              <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {formatTime(regionStart)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">End:</span>
              <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {formatTime(regionEnd)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
              <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {formatTime(regionEnd - regionStart)}
              </span>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tip: Click &quot;Create Selection&quot; to add a region on the waveform. You can drag the edges to adjust the selection, then use &quot;Trim &amp; Download&quot; to export the selected portion.
        </p>
      </div>
    </div>
  );
}
