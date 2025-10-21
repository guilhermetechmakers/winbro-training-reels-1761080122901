import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

const ClipViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    queryFn: () => clipsApi.search('', {
      machine_models: clip?.machine_model ? [clip.machine_model] : [],
      processes: clip?.process ? [clip.process] : [],
      limit: 6,
      exclude: id
    }),
    enabled: !!clip,
  });

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
            onBookmark={() => {
              // Handle bookmark action
              toast.success('Added to bookmarks');
            }}
            onAddToCourse={() => {
              // Handle add to course action
              toast.success('Added to course');
            }}
            onReport={() => {
              // Handle report action
              toast.success('Issue reported');
            }}
            onDownload={() => {
              // Handle download action
              toast.success('Download started');
            }}
            onShare={() => {
              // Handle share action
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard');
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              clip={clip}
              onTimeUpdate={() => {
                // Handle time updates for transcript sync
              }}
            />

            {/* Transcript & Timestamps */}
            {isTranscriptVisible && (
            <TranscriptTimestamps
              transcript={clip.transcript}
              onTimestampClick={() => {
                // Handle timestamp click
              }}
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
              clips={relatedClips?.clips || []}
              currentClipId={clip.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClipViewerPage;