import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

// Components
import VideoPlayer from '@/components/clip-viewer/VideoPlayer';
import ClipMetadataPanel from '@/components/clip-viewer/ClipMetadataPanel';
import TranscriptTimestamps from '@/components/clip-viewer/TranscriptTimestamps';
import AnnotationsNotes from '@/components/clip-viewer/AnnotationsNotes';
import ActionsPanel from '@/components/clip-viewer/ActionsPanel';
import RelatedClips from '@/components/clip-viewer/RelatedClips';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// API
import { clipsApi } from '@/lib/api';

// Types
import type { TranscriptSegment } from '@/types/content';

const ClipViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(true);
  const [isNotesVisible, setIsNotesVisible] = useState(false);

  // Fetch clip data
  const {
    data: clip,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['clip', id],
    queryFn: () => clipsApi.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch related clips
  const { data: relatedClips } = useQuery({
    queryKey: ['related-clips', id],
    queryFn: () => clipsApi.getRelated(id!, 6),
    enabled: !!id,
  });

  // Track view mutation
  const trackViewMutation = useMutation({
    mutationFn: (timeWatched: number) => clipsApi.trackView(id!, timeWatched),
    onError: (error) => {
      console.error('Failed to track view:', error);
    },
  });

  // Handle time updates
  const handleTimeUpdate = useCallback((time: number) => {
    // Track view every 10 seconds
    if (Math.floor(time) % 10 === 0) {
      trackViewMutation.mutate(time);
    }
  }, [trackViewMutation]);

  // Handle segment changes
  const handleSegmentChange = useCallback((segment: TranscriptSegment | null) => {
    // Handle segment highlighting if needed
    console.log('Active segment:', segment);
  }, []);

  // Handle timestamp clicks
  const handleTimestampClick = useCallback((time: number) => {
    // This would be handled by the video player
    console.log('Seek to:', time);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-8 w-64" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player Skeleton */}
            <div className="lg:col-span-2">
              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>
            
            {/* Metadata Panel Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !clip) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Clip Not Found</h1>
          </div>
          
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                This clip could not be found
              </h2>
              <p className="text-muted-foreground">
                The clip you're looking for may have been removed or you don't have permission to view it.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/library')}>
                  Browse Library
                </Button>
                <Button variant="outline" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground line-clamp-2">
                {clip.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {clip.machine_model} • {clip.process} • {Math.round(clip.duration)}s
              </p>
            </div>
          </div>
          
          <ActionsPanel 
            clip={clip}
            onBookmark={async () => {
              try {
                await clipsApi.bookmark(clip.id);
                queryClient.invalidateQueries({ queryKey: ['clip', id] });
                toast.success('Added to bookmarks');
              } catch (error) {
                toast.error('Failed to bookmark clip');
              }
            }}
            onAddToCourse={() => {
              // Navigate to course builder with this clip pre-selected
              navigate('/course-builder', { state: { selectedClip: clip } });
            }}
            onReport={async () => {
              try {
                await clipsApi.report(clip.id, 'content_issue', 'User reported an issue with this clip');
                toast.success('Issue reported successfully');
              } catch (error) {
                toast.error('Failed to report issue');
              }
            }}
            onDownload={async () => {
              try {
                const downloadData = await clipsApi.getDownloadUrl(clip.id);
                const link = document.createElement('a');
                link.href = downloadData.url;
                link.download = `${clip.title}.mp4`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('Download started');
              } catch (error) {
                toast.error('Download failed');
              }
            }}
            onShare={async () => {
              try {
                const shareData = await clipsApi.getShareUrl(clip.id);
                await navigator.clipboard.writeText(shareData.url);
                toast.success('Share link copied to clipboard');
              } catch (error) {
                // Fallback to current URL
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard');
              }
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              clip={clip}
              onTimeUpdate={handleTimeUpdate}
              onSegmentChange={handleSegmentChange}
            />

            {/* Transcript & Timestamps */}
            {isTranscriptVisible && (
            <TranscriptTimestamps
              transcript={clip.transcript}
              onTimestampClick={handleTimestampClick}
              onToggleVisibility={() => setIsTranscriptVisible(false)}
            />
            )}

            {/* Annotations & Notes */}
            {isNotesVisible && (
              <AnnotationsNotes
                clipId={clip.id}
                onToggleVisibility={() => setIsNotesVisible(false)}
              />
            )}

            {/* Toggle Buttons */}
            <div className="flex gap-2">
              <Button
                variant={isTranscriptVisible ? "default" : "outline"}
                size="sm"
                onClick={() => setIsTranscriptVisible(!isTranscriptVisible)}
              >
                {isTranscriptVisible ? 'Hide' : 'Show'} Transcript
              </Button>
              <Button
                variant={isNotesVisible ? "default" : "outline"}
                size="sm"
                onClick={() => setIsNotesVisible(!isNotesVisible)}
              >
                {isNotesVisible ? 'Hide' : 'Show'} Notes
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata Panel */}
            <ClipMetadataPanel clip={clip} />

            {/* Related Clips */}
            <RelatedClips 
              clips={relatedClips || []}
              currentClipId={clip.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClipViewerPage;