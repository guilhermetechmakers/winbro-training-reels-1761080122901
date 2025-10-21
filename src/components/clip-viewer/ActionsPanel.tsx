import React, { useState } from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  Plus, 
  Flag, 
  Download, 
  Share2, 
  Copy, 
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Clip } from '@/types/content';

interface ActionsPanelProps {
  clip: Clip;
  onBookmark?: () => void;
  onAddToCourse?: () => void;
  onReport?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
}

const ActionsPanel: React.FC<ActionsPanelProps> = ({
  clip,
  onBookmark,
  onAddToCourse,
  onReport,
  onDownload,
  onShare,
  className
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Handle bookmark toggle
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  // Handle add to course
  const handleAddToCourse = () => {
    onAddToCourse?.();
    toast.success('Added to course');
  };

  // Handle report
  const handleReport = () => {
    onReport?.();
    toast.success('Issue reported successfully');
  };

  // Handle download
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      onDownload?.();
      toast.success('Download started');
    } catch (error) {
      toast.error('Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: clip.title,
          text: `Check out this training clip: ${clip.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
      onShare?.();
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } finally {
      setIsSharing(false);
    }
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // Share on social media
  const shareOnSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(clip.title);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Bookmark */}
          <Button
            variant={isBookmarked ? "default" : "outline"}
            className="w-full justify-start"
            onClick={handleBookmark}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 mr-2" />
            ) : (
              <Bookmark className="h-4 w-4 mr-2" />
            )}
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>

          {/* Add to Course */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleAddToCourse}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Course
          </Button>

          {/* Download */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>

          {/* Share */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={isSharing}
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {isSharing ? 'Sharing...' : 'Share'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={copyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareOnSocial('twitter')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Share on Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareOnSocial('linkedin')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Share on LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareOnSocial('facebook')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Share on Facebook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator />

          {/* Report Issue */}
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleReport}
          >
            <Flag className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        </CardContent>
      </Card>

      {/* Clip Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Processing</span>
            <div className="flex items-center gap-2">
              {clip.metadata?.processing_status === 'completed' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <Badge
                variant={
                  clip.metadata?.processing_status === 'completed' 
                    ? 'default' 
                    : 'secondary'
                }
                className="text-xs"
              >
                {clip.metadata?.processing_status || 'Unknown'}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Virus Scan</span>
            <Badge
              variant={
                clip.metadata?.virus_scan_status === 'clean' 
                  ? 'default' 
                  : clip.metadata?.virus_scan_status === 'infected'
                  ? 'destructive'
                  : 'secondary'
              }
              className="text-xs"
            >
              {clip.metadata?.virus_scan_status || 'Unknown'}
            </Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Moderation</span>
            <Badge
              variant={
                clip.status === 'published' 
                  ? 'default' 
                  : clip.status === 'rejected'
                  ? 'destructive'
                  : 'secondary'
              }
              className="text-xs"
            >
              {clip.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Views</span>
            <span className="text-sm font-medium">
              {clip.view_count.toLocaleString()}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Bookmarks</span>
            <span className="text-sm font-medium">
              {clip.bookmark_count.toLocaleString()}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Duration</span>
            <span className="text-sm font-medium">
              {Math.round(clip.duration)}s
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">File Size</span>
            <span className="text-sm font-medium">
              {clip.metadata?.file_size 
                ? `${(clip.metadata.file_size / (1024 * 1024)).toFixed(1)} MB`
                : 'Unknown'
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Download</span>
            <Badge variant="outline" className="text-xs">
              {clip.metadata?.file_size ? 'Allowed' : 'Restricted'}
            </Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Share</span>
            <Badge variant="outline" className="text-xs">
              Allowed
            </Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Comments</span>
            <Badge variant="outline" className="text-xs">
              Enabled
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionsPanel;