import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize, 
  RotateCcw,
  Bookmark,
  Share,
  Download,
  Clock,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Clip, LearningPlayerNode } from '@/types/content';

interface ClipPlayerProps {
  node: LearningPlayerNode;
  clip?: Clip;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onBookmark: () => void;
  onShare: () => void;
  onDownload: () => void;
  onComplete: () => void;
  className?: string;
}

const ClipPlayer: React.FC<ClipPlayerProps> = ({
  node,
  clip,
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackRate,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  onBookmark,
  onShare,
  onDownload,
  onComplete,
  className = ''
}) => {
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number>();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleSeek = (value: number[]) => {
    onSeek(value[0]);
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
    onVolumeChange(isMuted ? 1 : 0);
  };

  const handleSkipBack = () => {
    onSeek(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = () => {
    onSeek(Math.min(duration, currentTime + 10));
  };

  const handlePlaybackRateChange = (rate: number) => {
    onPlaybackRateChange(rate);
    setShowSettings(false);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Check for completion
  useEffect(() => {
    if (currentTime >= duration && duration > 0 && !node.is_completed) {
      onComplete();
    }
  }, [currentTime, duration, node.is_completed, onComplete]);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div 
          className="relative aspect-video bg-black group cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={clip?.thumbnail_url}
            onTimeUpdate={(e) => onSeek(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => onSeek(e.currentTarget.duration)}
            onEnded={onComplete}
          >
            <source src={clip?.video_url} type="video/mp4" />
            <source src={clip?.hls_url} type="application/x-mpegURL" />
            Your browser does not support the video tag.
          </video>

          {/* Loading Overlay */}
          {!clip && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center text-muted-foreground">
                <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Loading video...</p>
              </div>
            </div>
          )}

          {/* Play/Pause Overlay */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onPlayPause}
              >
                <motion.div
                  className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-8 w-8 text-black ml-1" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Progress Bar */}
                <div className="mb-4">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={onPlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={handleSkipBack}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={handleSkipForward}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1 text-white text-sm">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={handleVolumeToggle}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="w-20">
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          max={1}
                          step={0.1}
                          onValueChange={(value) => onVolumeChange(value[0])}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Settings Menu */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={() => setShowSettings(!showSettings)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>

                      <AnimatePresence>
                        {showSettings && (
                          <motion.div
                            className="absolute bottom-10 right-0 bg-black/90 rounded-lg p-2 min-w-32"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            <div className="space-y-1">
                              <div className="text-xs text-white/80 px-2 py-1">Playback Speed</div>
                              {playbackRates.map((rate) => (
                                <button
                                  key={rate}
                                  className={`w-full text-left px-2 py-1 text-xs rounded hover:bg-white/20 ${
                                    playbackRate === rate ? 'text-primary' : 'text-white'
                                  }`}
                                  onClick={() => handlePlaybackRateChange(rate)}
                                >
                                  {rate}x
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Fullscreen */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={handleFullscreen}
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Info Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {node.estimated_duration} min
              </Badge>
              {node.is_completed && (
                <Badge variant="default" className="text-xs bg-success">
                  Completed
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={onBookmark}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={onShare}
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={onDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Details */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground">{node.title}</h3>
            {node.description && (
              <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
            )}
          </div>

          {clip && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {clip.duration} seconds
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="h-3 w-3" />
                {node.attempts} attempts
              </span>
              {clip.machine_model && (
                <Badge variant="outline" className="text-xs">
                  {clip.machine_model}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClipPlayer;
