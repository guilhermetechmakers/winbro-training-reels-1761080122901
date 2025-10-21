import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { TranscriptSegment } from '@/types/content';

interface TranscriptTimestampsProps {
  transcript: TranscriptSegment[];
  onTimestampClick?: (time: number) => void;
  onToggleVisibility?: () => void;
  className?: string;
}

const TranscriptTimestamps: React.FC<TranscriptTimestampsProps> = ({
  transcript,
  onTimestampClick,
  onToggleVisibility,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTranscript, setFilteredTranscript] = useState<TranscriptSegment[]>(transcript);
  const [highlightedSegment, setHighlightedSegment] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Format time for display
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get confidence badge variant
  const getConfidenceBadge = (confidence: number): string => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  // Filter transcript based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTranscript(transcript);
    } else {
      const filtered = transcript.filter(segment =>
        segment.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTranscript(filtered);
    }
  }, [searchQuery, transcript]);

  // Handle timestamp click
  const handleTimestampClick = (time: number) => {
    onTimestampClick?.(time);
  };

  // Handle segment click
  const handleSegmentClick = (segment: TranscriptSegment) => {
    handleTimestampClick(segment.start_time);
    setHighlightedSegment(segment.id);
    
    // Remove highlight after a short delay
    setTimeout(() => {
      setHighlightedSegment(null);
    }, 2000);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the video player
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, this would control the video player
  };

  // Scroll to highlighted segment
  useEffect(() => {
    if (highlightedSegment && scrollAreaRef.current) {
      const element = document.getElementById(`segment-${highlightedSegment}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedSegment]);

  if (!transcript || transcript.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Transcript</CardTitle>
            {onToggleVisibility && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transcript available for this clip.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Transcript</CardTitle>
          {onToggleVisibility && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleVisibility}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Controls */}
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayPause}
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className="flex items-center gap-2"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>

            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                {filteredTranscript.length} of {transcript.length} segments
              </Badge>
            )}
          </div>
        </div>

        {/* Transcript Content */}
        <ScrollArea ref={scrollAreaRef} className="h-96">
          <div className="space-y-2 pr-4">
            {filteredTranscript.map((segment) => (
              <div
                key={segment.id}
                id={`segment-${segment.id}`}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-muted/50",
                  highlightedSegment === segment.id && "bg-primary/10 border-primary/20",
                  "group"
                )}
                onClick={() => handleSegmentClick(segment)}
              >
                <div className="flex items-start gap-3">
                  {/* Timestamp */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTimestampClick(segment.start_time);
                    }}
                    className="flex-shrink-0 mt-1 text-sm font-mono text-primary hover:text-primary/80 transition-colors"
                  >
                    {formatTime(segment.start_time)}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-foreground leading-relaxed">
                        {segment.text}
                      </p>
                      
                      {/* Confidence Badge */}
                      <Badge
                        className={cn(
                          "text-xs flex-shrink-0",
                          getConfidenceBadge(segment.confidence)
                        )}
                      >
                        {Math.round(segment.confidence * 100)}%
                      </Badge>
                    </div>

                    {/* Speaker */}
                    {segment.speaker && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {segment.speaker}
                      </p>
                    )}

                    {/* Duration */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Duration: {formatTime(segment.end_time - segment.start_time)}
                      </span>
                      <span className={cn(
                        "text-xs",
                        getConfidenceColor(segment.confidence)
                      )}>
                        Confidence: {Math.round(segment.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filteredTranscript.length} segment{filteredTranscript.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
            <span>
              Total duration: {formatTime(transcript[transcript.length - 1]?.end_time || 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptTimestamps;