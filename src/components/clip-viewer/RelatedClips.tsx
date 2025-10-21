import React from 'react';
import { Play, Eye, Bookmark, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import type { Clip } from '@/types/content';

interface RelatedClipsProps {
  clips: Clip[];
  currentClipId: string;
  className?: string;
}

const RelatedClips: React.FC<RelatedClipsProps> = ({
  clips,
  currentClipId,
  className
}) => {
  const navigate = useNavigate();

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get skill level color
  const getSkillLevelColor = (level: string): string => {
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

  // Handle clip click
  const handleClipClick = (clipId: string) => {
    navigate(`/clip/${clipId}`);
  };

  // Filter out current clip
  const relatedClips = clips.filter(clip => clip.id !== currentClipId);

  if (relatedClips.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Related Clips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-sm font-medium text-foreground mb-2">No related clips found</h3>
            <p className="text-xs text-muted-foreground">
              Try browsing the library for more content.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Related Clips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedClips.slice(0, 6).map((clip) => (
          <div
            key={clip.id}
            className="group cursor-pointer"
            onClick={() => handleClipClick(clip.id)}
          >
            <div className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              {/* Thumbnail */}
              <div className="relative flex-shrink-0 w-24 h-16 bg-muted rounded-lg overflow-hidden">
                <img
                  src={clip.thumbnail_url}
                  alt={clip.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-1 right-1">
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {formatDuration(clip.duration)}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                  {clip.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">
                    {clip.machine_model}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {clip.process}
                  </span>
                </div>

                {/* Tags */}
                {clip.tags && clip.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {clip.tags.slice(0, 2).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs px-1 py-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {clip.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        +{clip.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {clip.view_count.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bookmark className="h-3 w-3" />
                      {clip.bookmark_count}
                    </div>
                  </div>
                  <span>{formatDate(clip.created_at)}</span>
                </div>

                {/* Skill Level */}
                <div className="mt-2">
                  <Badge
                    className={cn(
                      "text-xs",
                      getSkillLevelColor(clip.skill_level)
                    )}
                  >
                    {clip.skill_level.charAt(0).toUpperCase() + clip.skill_level.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* View All Button */}
        {relatedClips.length > 6 && (
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/library')}
            >
              View All Related Clips
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedClips;