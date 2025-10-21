import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, PictureInPicture, RotateCcw, SkipBack, SkipForward, Settings, Captions } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import type { Clip, TranscriptSegment } from '@/types/content';

interface VideoPlayerProps {
  clip: Clip;
  onTimeUpdate?: (time: number) => void;
  onSegmentChange?: (segment: TranscriptSegment | null) => void;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  clip,
  onTimeUpdate,
  onSegmentChange,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [isLooping, setIsLooping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [hlsSupported, setHlsSupported] = useState(false);

  // Available quality options
  const qualityOptions = [
    { value: 'auto', label: 'Auto' },
    { value: '1080p', label: '1080p' },
    { value: '720p', label: '720p' },
    { value: '480p', label: '480p' },
    { value: '360p', label: '360p' }
  ];

  // Playback speed options
  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' }
  ];

  // Format time for display
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Error toggling play/pause:', err);
      setError('Failed to play video');
    }
  };

  // Handle seek
  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    const newTime = (value[0] / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    const newVolume = value[0] / 100;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Handle playback rate change
  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackRate(speed);
  };

  // Handle quality change
  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    // In a real implementation, this would switch video sources
    // For now, we'll just update the state
  };

  // Handle loop toggle
  const toggleLoop = () => {
    if (!videoRef.current) return;
    videoRef.current.loop = !isLooping;
    setIsLooping(!isLooping);
  };

  // Handle skip forward/backward
  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  // Handle fullscreen toggle
  const toggleFullscreen = async () => {
    if (!videoRef.current) return;

    try {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          await videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  // Handle picture-in-picture toggle
  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;

    try {
      if (!isPictureInPicture) {
        if (videoRef.current.requestPictureInPicture) {
          await videoRef.current.requestPictureInPicture();
        }
      } else {
        if (document.exitPictureInPicture) {
          await document.exitPictureInPicture();
        }
      }
    } catch (err) {
      console.error('Error toggling picture-in-picture:', err);
    }
  };

  // Check for HLS support
  useEffect(() => {
    const checkHlsSupport = () => {
      const video = document.createElement('video');
      const canPlayHls = video.canPlayType('application/vnd.apple.mpegurl') || 
                        video.canPlayType('application/x-mpegURL');
      setHlsSupported(!!canPlayHls);
    };
    checkHlsSupport();
  }, []);

  // Handle transcript segment highlighting
  const updateActiveSegment = useCallback((time: number) => {
    if (!clip.transcript || clip.transcript.length === 0) return;
    
    const activeSegment = clip.transcript.find(segment => 
      time >= segment.start_time && time <= segment.end_time
    );
    
    if (activeSegment && activeSegment.id !== activeSegmentId) {
      setActiveSegmentId(activeSegment.id);
      onSegmentChange?.(activeSegment);
    } else if (!activeSegment && activeSegmentId) {
      setActiveSegmentId(null);
      onSegmentChange?.(null);
    }
  }, [clip.transcript, activeSegmentId, onSegmentChange]);

  // Event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError('Failed to load video');
      setIsLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);
      updateActiveSegment(video.currentTime);
    };
    const handleDurationChange = () => setDuration(video.duration);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    const handlePictureInPictureChange = () => {
      setIsPictureInPicture(!!document.pictureInPictureElement);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('volumechange', handleVolumeChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('pictureinpicturechange', handlePictureInPictureChange);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('volumechange', handleVolumeChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('pictureinpicturechange', handlePictureInPictureChange);
    };
  }, [onTimeUpdate, updateActiveSegment]);

  // Auto-hide controls
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentTime]);

  if (error) {
    return (
      <Card className={cn("aspect-video flex items-center justify-center", className)}>
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Video Error</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("relative group overflow-hidden", className)}>
      <div 
        className="relative aspect-video bg-black"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onMouseMove={() => setShowControls(true)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={clip.thumbnail_url}
          preload="metadata"
          playsInline
          crossOrigin="anonymous"
        >
          {hlsSupported && clip.hls_url && (
            <source src={clip.hls_url} type="application/x-mpegURL" />
          )}
          <source src={clip.video_url} type="video/mp4" />
          {captionsEnabled && clip.transcript && (
            <track
              kind="captions"
              src={`/api/clips/${clip.id}/captions.vtt`}
              srcLang="en"
              label="English"
              default
            />
          )}
          Your browser does not support the video tag.
        </video>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* Play Button Overlay */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-black/50 hover:bg-black/70"
              onClick={togglePlayPause}
            >
              <Play className="h-8 w-8 text-white" />
            </Button>
          </div>
        )}

        {/* Controls Overlay */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}>
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              className="w-full"
              max={100}
              step={0.1}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              {/* Skip Backward */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(-10)}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              {/* Skip Forward */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(10)}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              {/* Time Display */}
              <span className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Playback Speed */}
              <Select value={playbackRate.toString()} onValueChange={(value) => handleSpeedChange(parseFloat(value))}>
                <SelectTrigger className="w-20 h-8 text-white bg-transparent border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {speedOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Captions Toggle */}
              <Toggle
                pressed={captionsEnabled}
                onPressedChange={setCaptionsEnabled}
                className="text-white hover:bg-white/20 data-[state=on]:bg-white/20"
              >
                <Captions className="h-4 w-4" />
              </Toggle>

              {/* Settings */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
              </Button>

              {/* Quality Selector */}
              <Select value={quality} onValueChange={handleQualityChange}>
                <SelectTrigger className="w-20 h-8 text-white bg-transparent border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qualityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Loop Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLoop}
                className={cn(
                  "text-white hover:bg-white/20",
                  isLooping && "bg-white/20"
                )}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              {/* Picture-in-Picture */}
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePictureInPicture}
                className="text-white hover:bg-white/20"
              >
                <PictureInPicture className="h-4 w-4" />
              </Button>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="absolute bottom-16 right-4 bg-black/90 rounded-lg p-4 space-y-3 min-w-48">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Playback Speed</label>
                <Select value={playbackRate.toString()} onValueChange={(value) => handleSpeedChange(parseFloat(value))}>
                  <SelectTrigger className="w-full h-8 text-white bg-transparent border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {speedOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Quality</label>
                <Select value={quality} onValueChange={handleQualityChange}>
                  <SelectTrigger className="w-full h-8 text-white bg-transparent border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-white text-sm font-medium">Loop</label>
                  <Toggle
                    pressed={isLooping}
                    onPressedChange={toggleLoop}
                    className="text-white hover:bg-white/20 data-[state=on]:bg-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Toggle>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;