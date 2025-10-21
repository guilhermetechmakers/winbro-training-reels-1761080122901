import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  Captions,
  PictureInPicture,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2
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
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
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

  const handlePictureInPicture = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else if (videoRef.current) {
      videoRef.current.requestPictureInPicture();
    }
  };

  const handleRefresh = () => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsLoading(true);
      setHasError(false);
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

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlayThrough = () => setIsBuffering(false);
    const handleEnterPictureInPicture = () => setIsPictureInPicture(true);
    const handleLeavePictureInPicture = () => setIsPictureInPicture(false);

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('enterpictureinpicture', handleEnterPictureInPicture);
    video.addEventListener('leavepictureinpicture', handleLeavePictureInPicture);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('enterpictureinpicture', handleEnterPictureInPicture);
      video.removeEventListener('leavepictureinpicture', handleLeavePictureInPicture);
    };
  }, []);

  // Check for completion
  useEffect(() => {
    if (currentTime >= duration && duration > 0 && !node.is_completed) {
      onComplete();
    }
  }, [currentTime, duration, node.is_completed, onComplete]);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <Card className={`overflow-hidden shadow-lg ${className}`}>
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
            playsInline
            preload="metadata"
          >
            <source src={clip?.video_url} type="video/mp4" />
            <source src={clip?.hls_url} type="application/x-mpegURL" />
            {showCaptions && clip?.transcript && (
              <track
                kind="captions"
                srcLang="en"
                label="English"
                default
              />
            )}
            Your browser does not support the video tag.
          </video>

          {/* Loading Overlay */}
          <AnimatePresence>
            {(isLoading || !clip) && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center text-white">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                  <p className="text-sm">Loading video...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Overlay */}
          <AnimatePresence>
            {hasError && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center text-white">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-error" />
                  <p className="text-sm mb-4">Failed to load video</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buffering Overlay */}
          <AnimatePresence>
            {isBuffering && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center text-white">
                  <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  <p className="text-xs">Buffering...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Play/Pause Overlay */}
          <AnimatePresence>
            {!isPlaying && !isLoading && !hasError && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onPlayPause}
              >
                <motion.div
                  className="w-24 h-24 bg-white/95 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Play className="h-10 w-10 text-black ml-1" />
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
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 h-10 w-10 p-0"
                            onClick={onPlayPause}
                          >
                            {isPlaying ? (
                              <Pause className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isPlaying ? 'Pause' : 'Play'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 h-10 w-10 p-0"
                            onClick={handleSkipBack}
                          >
                            <SkipBack className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Skip back 10s</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 h-10 w-10 p-0"
                            onClick={handleSkipForward}
                          >
                            <SkipForward className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Skip forward 10s</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="flex items-center gap-2 text-white text-sm ml-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/20 h-10 w-10 p-0"
                              onClick={handleVolumeToggle}
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX className="h-4 w-4" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isMuted ? 'Unmute' : 'Mute'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="w-24">
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          max={1}
                          step={0.1}
                          onValueChange={(value) => onVolumeChange(value[0])}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Captions Toggle */}
                    {clip?.transcript && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`text-white hover:bg-white/20 h-10 w-10 p-0 ${
                                showCaptions ? 'bg-white/20' : ''
                              }`}
                              onClick={() => setShowCaptions(!showCaptions)}
                            >
                              <Captions className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{showCaptions ? 'Hide captions' : 'Show captions'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {/* Picture-in-Picture */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`text-white hover:bg-white/20 h-10 w-10 p-0 ${
                              isPictureInPicture ? 'bg-white/20' : ''
                            }`}
                            onClick={handlePictureInPicture}
                          >
                            <PictureInPicture className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isPictureInPicture ? 'Exit PiP' : 'Picture-in-Picture'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Settings Menu */}
                    <div className="relative">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/20 h-10 w-10 p-0"
                              onClick={() => setShowSettings(!showSettings)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Settings</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <AnimatePresence>
                        {showSettings && (
                          <motion.div
                            className="absolute bottom-12 right-0 bg-black/95 backdrop-blur-sm rounded-xl p-3 min-w-40 shadow-2xl border border-white/10"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <div className="space-y-2">
                              <div className="text-xs text-white/80 px-2 py-1 font-medium">Playback Speed</div>
                              {playbackRates.map((rate) => (
                                <button
                                  key={rate}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/20 transition-colors ${
                                    playbackRate === rate 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'text-white'
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 h-10 w-10 p-0"
                            onClick={handleFullscreen}
                          >
                            <Maximize className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fullscreen</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Info Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-white/90 text-black">
                {node.estimated_duration} min
              </Badge>
              {node.is_completed && (
                <Badge variant="default" className="text-xs bg-success text-success-foreground px-2 py-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                      onClick={onBookmark}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bookmark</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                      onClick={onShare}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                      onClick={onDownload}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Video Details */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-lg">{node.title}</h3>
            {node.description && (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{node.description}</p>
            )}
          </div>

          {clip && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{clip.duration} seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                <span>{node.attempts} attempts</span>
              </div>
              {clip.machine_model && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  {clip.machine_model}
                </Badge>
              )}
              {clip.skill_level && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  {clip.skill_level}
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
