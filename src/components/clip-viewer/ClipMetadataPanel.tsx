import React from 'react';
import { Calendar, User, Tag, Wrench, Clock, Eye, Bookmark, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Clip, SkillLevel } from '@/types/content';

interface ClipMetadataPanelProps {
  clip: Clip;
  className?: string;
}

const ClipMetadataPanel: React.FC<ClipMetadataPanelProps> = ({
  clip,
  className
}) => {
  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get skill level color
  const getSkillLevelColor = (level: SkillLevel): string => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Basic Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Clip Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <h3 className="font-medium text-foreground mb-1">Title</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {clip.title}
            </p>
          </div>

          {/* Description */}
          {clip.description && (
            <div>
              <h3 className="font-medium text-foreground mb-1">Description</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {clip.description}
              </p>
            </div>
          )}

          {/* Machine Model */}
          <div>
            <h3 className="font-medium text-foreground mb-1">Machine Model</h3>
            <p className="text-sm text-muted-foreground">
              {clip.machine_model}
            </p>
          </div>

          {/* Process */}
          <div>
            <h3 className="font-medium text-foreground mb-1">Process</h3>
            <p className="text-sm text-muted-foreground">
              {clip.process}
            </p>
          </div>

          {/* Tooling */}
          {clip.tooling && clip.tooling.length > 0 && (
            <div>
              <h3 className="font-medium text-foreground mb-2">Tooling</h3>
              <div className="flex flex-wrap gap-1">
                {clip.tooling.map((tool, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs"
                  >
                    <Wrench className="h-3 w-3 mr-1" />
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Skill Level */}
          <div>
            <h3 className="font-medium text-foreground mb-2">Skill Level</h3>
            <Badge
              className={cn(
                "text-xs font-medium",
                getSkillLevelColor(clip.skill_level)
              )}
            >
              <Award className="h-3 w-3 mr-1" />
              {clip.skill_level.charAt(0).toUpperCase() + clip.skill_level.slice(1)}
            </Badge>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-medium text-foreground mb-2">Status</h3>
            <Badge
              className={cn(
                "text-xs font-medium",
                getStatusColor(clip.status)
              )}
            >
              {clip.status.charAt(0).toUpperCase() + clip.status.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Author Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Author
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {clip.author.full_name || clip.author.email}
              </p>
              <p className="text-sm text-muted-foreground">
                {clip.author.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Duration</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {formatDuration(clip.duration)}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Views</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {clip.view_count.toLocaleString()}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Bookmarks</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {clip.bookmark_count.toLocaleString()}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Published</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {clip.published_at ? formatDate(clip.published_at) : 'Not published'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {clip.tags && clip.tags.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {clip.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs hover:bg-primary/10 cursor-pointer transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      {clip.metadata && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                className={cn(
                  "text-xs",
                  clip.metadata.processing_status === 'completed' 
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : clip.metadata.processing_status === 'failed'
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                )}
              >
                {clip.metadata.processing_status}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Resolution</span>
              <span className="text-sm font-medium text-foreground">
                {clip.metadata.resolution}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Frame Rate</span>
              <span className="text-sm font-medium text-foreground">
                {clip.metadata.frame_rate} fps
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bitrate</span>
              <span className="text-sm font-medium text-foreground">
                {Math.round(clip.metadata.bitrate / 1000)} kbps
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">File Size</span>
              <span className="text-sm font-medium text-foreground">
                {(clip.metadata.file_size / (1024 * 1024)).toFixed(1)} MB
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClipMetadataPanel;