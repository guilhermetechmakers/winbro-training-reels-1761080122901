import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Play, 
  Clock, 
  User, 
  Plus,
  Check,
  X,
  Grid3X3,
  List,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Clip, SkillLevel, ContentStatus } from '@/types/content';
import { useClips } from '@/hooks/useClips';

interface ClipPickerProps {
  onClipsSelect: (clips: Clip[]) => void;
  selectedClips?: Clip[];
}

const ClipPicker: React.FC<ClipPickerProps> = ({ onClipsSelect, selectedClips = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    machine_models: [] as string[],
    processes: [] as string[],
    skill_levels: [] as SkillLevel[],
    tags: [] as string[],
    authors: [] as string[],
    status: [] as ContentStatus[]
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: clips, isLoading, error } = useClips({
    query: searchQuery,
    machine_models: filters.machine_models,
    processes: filters.processes,
    skill_levels: filters.skill_levels,
    tags: filters.tags,
    authors: filters.authors,
    status: filters.status
  });

  const selectedClipIds = useMemo(() => 
    new Set(selectedClips.map(clip => clip.id)), 
    [selectedClips]
  );

  const handleClipToggle = (clip: Clip) => {
    if (selectedClipIds.has(clip.id)) {
      onClipsSelect(selectedClips.filter((c: Clip) => c.id !== clip.id));
    } else {
      onClipsSelect([...selectedClips, clip]);
    }
  };

  const handleSelectAll = () => {
    if (clips && clips.length > 0) {
      const allSelected = clips.every((clip: Clip) => selectedClipIds.has(clip.id));
      if (allSelected) {
        onClipsSelect([]);
      } else {
        onClipsSelect([...clips]);
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      machine_models: [],
      processes: [],
      skill_levels: [],
      tags: [],
      authors: [],
      status: []
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSkillLevelColor = (level: SkillLevel) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-10 bg-muted rounded-md w-64 animate-pulse" />
          <div className="h-10 bg-muted rounded-md w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-4">Failed to load clips</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Select Clips</h2>
          <p className="text-sm text-muted-foreground">
            Choose video clips to add to your course
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clips by title, description, or transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleSelectAll}
            disabled={!clips || clips.length === 0}
          >
            {clips && clips.every((clip: Clip) => selectedClipIds.has(clip.id)) ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        {/* Filters Panel */}
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span>Advanced Filters</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
              <div>
                <label className="text-sm font-medium mb-2 block">Machine Models</label>
                <Select
                  value={filters.machine_models[0] || ''}
                  onValueChange={(value) => 
                    setFilters(prev => ({ 
                      ...prev, 
                      machine_models: value ? [value] : [] 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Models</SelectItem>
                    <SelectItem value="model-a">Model A</SelectItem>
                    <SelectItem value="model-b">Model B</SelectItem>
                    <SelectItem value="model-c">Model C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Skill Level</label>
                <Select
                  value={filters.skill_levels[0] || ''}
                  onValueChange={(value) => 
                    setFilters(prev => ({ 
                      ...prev, 
                      skill_levels: value ? [value as SkillLevel] : [] 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={filters.status[0] || ''}
                  onValueChange={(value) => 
                    setFilters(prev => ({ 
                      ...prev, 
                      status: value ? [value as ContentStatus] : [] 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <div className="text-sm text-muted-foreground">
                {clips?.length || 0} clips found
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Clips Grid/List */}
      {clips && clips.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-2'
        }>
          {clips?.map((clip: Clip) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedClipIds.has(clip.id) 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleClipToggle(clip)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm line-clamp-2">{clip.title}</CardTitle>
                      <CardDescription className="text-xs line-clamp-1">
                        {clip.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {selectedClipIds.has(clip.id) ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-muted rounded-md mb-3 overflow-hidden">
                    <img
                      src={clip.thumbnail_url}
                      alt={clip.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {formatDuration(clip.duration)}
                      </Badge>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(clip.duration)}</span>
                      <span>•</span>
                      <span>{clip.machine_model}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{clip.author.name}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSkillLevelColor(clip.skill_level)}`}
                      >
                        {clip.skill_level}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(clip.status)}`}
                      >
                        {clip.status}
                      </Badge>
                    </div>

                    {clip.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {clip.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {clip.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{clip.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Play className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No clips found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Selected Clips Summary */}
      {selectedClips.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-card border rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">
              {selectedClips.length} clip{selectedClips.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClipsSelect([])}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {selectedClips.map((clip) => (
              <div key={clip.id} className="flex items-center space-x-2 text-xs">
                <Play className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{clip.title}</span>
              </div>
            ))}
          </div>
          <Button 
            className="w-full mt-3" 
            onClick={() => {
              // Handle adding clips to course
              console.log('Adding clips to course:', selectedClips);
            }}
          >
            Add to Course
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClipPicker;
