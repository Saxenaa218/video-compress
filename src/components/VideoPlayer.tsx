'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface VideoPlayerProps {
  src: string;
  title: string;
}

interface QualityLevel {
  height: number;
  width: number;
  bitrate: number;
  name: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 = auto
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      });

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsLoading(false);
        const levels: QualityLevel[] = data.levels.map((level, index) => ({
          height: level.height,
          width: level.width,
          bitrate: level.bitrate,
          name: level.height ? `${level.height}p` : `Level ${index + 1}`
        }));
        setQualityLevels(levels);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        if (hlsRef.current?.autoLevelEnabled) {
          setCurrentQuality(-1);
        } else {
          setCurrentQuality(data.level);
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error occurred. Please check your connection.');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error occurred. Attempting recovery...');
              hls.recoverMediaError();
              break;
            default:
              setError('An error occurred while loading the video.');
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', () => setIsLoading(false));
    }
  }, [src]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleQualityChange = (level: number) => {
    if (hlsRef.current) {
      if (level === -1) {
        hlsRef.current.currentLevel = -1; // Auto
      } else {
        hlsRef.current.currentLevel = level;
      }
      setCurrentQuality(level);
    }
    setShowQualityMenu(false);
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const getCurrentQualityLabel = (): string => {
    if (currentQuality === -1) return 'Auto';
    const level = qualityLevels[currentQuality];
    return level ? level.name : 'Auto';
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Back button */}
      <Link
        href="/"
        className={`absolute top-4 left-4 z-20 flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-lg transition-opacity duration-300 hover:bg-black/70 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronLeft size={20} />
        <span>Back to Browse</span>
      </Link>

      {/* Title */}
      <div
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 text-white text-xl font-semibold transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {title}
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white p-4">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
            >
              Reload
            </button>
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
      />

      {/* Play button overlay */}
      {!isPlaying && !isLoading && !error && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors">
            <Play size={40} className="text-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress bar */}
        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <div className="flex justify-between text-white text-sm mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-red-500 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:text-red-500 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Quality selector */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="flex items-center gap-2 text-white hover:text-red-500 transition-colors"
                aria-label="Quality settings"
              >
                <Settings size={24} />
                <span className="text-sm">{getCurrentQualityLabel()}</span>
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg overflow-hidden shadow-xl min-w-[150px]">
                  <button
                    onClick={() => handleQualityChange(-1)}
                    className={`w-full px-4 py-2 text-left text-white hover:bg-gray-800 ${
                      currentQuality === -1 ? 'bg-red-600' : ''
                    }`}
                  >
                    Auto
                  </button>
                  {qualityLevels.map((level, index) => (
                    <button
                      key={index}
                      onClick={() => handleQualityChange(index)}
                      className={`w-full px-4 py-2 text-left text-white hover:bg-gray-800 ${
                        currentQuality === index ? 'bg-red-600' : ''
                      }`}
                    >
                      {level.name}
                      <span className="text-gray-400 text-xs ml-2">
                        ({Math.round(level.bitrate / 1000)}kbps)
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-red-500 transition-colors"
              aria-label="Toggle fullscreen"
            >
              <Maximize size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
