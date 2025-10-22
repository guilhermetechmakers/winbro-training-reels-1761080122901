import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid3X3, List, SortAsc, SortDesc, Play, Bookmark, Plus, ChevronDown, ChevronUp, Share, Download } from 'lucide-react';

import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClips, useSearchClips, useBookmarkClip, useUnbookmarkClip } from '@/hooks/useClips';
import { toast } from 'sonner';
import type { Clip, SearchFilters, SkillLevel } from '@/types';

const ContentLibraryBrowse: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'most_viewed' | 'recommended'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    machine_models: true,
    processes: true,
    tags: true,
    skill_levels: true,
    authors: true,
    duration: true,
    date_range: true
  });

  // Use search query if present, otherwise use general clips query
  const { data: searchResults, isLoading: isSearchLoading } = useSearchClips(searchQuery, filters);
  const { data: clipsData, isLoading: isClipsLoading } = useClips(filters);

  const clips = searchQuery ? searchResults?.clips || [] : clipsData?.clips || [];
  const isLoading = searchQuery ? isSearchLoading : isClipsLoading;

  const bookmarkClip = useBookmarkClip();
  const unbookmarkClip = useUnbookmarkClip();

  // Sort clips based on selected criteria
  const sortedClips = useMemo(() => {
    if (!clips.length) return [];

    return [...clips].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'newest':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'most_viewed':
          comparison = a.view_count - b.view_count;
          break;
        case 'recommended':
          // For recommended, use a combination of views and recency
          const aScore = a.view_count * 0.7 + (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24) * 0.3;
          const bScore = b.view_count * 0.7 + (Date.now() - new Date(b.created_at).getTime()) / (1000 * 60 * 60 * 24) * 0.3;
          comparison = aScore - bScore;
          break;
        case 'relevance':
        default:
          // For relevance, maintain original order (search results are already sorted by relevance)
          return 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [clips, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedClips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClips = sortedClips.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy, sortOrder]);

  const handleClipClick = (clipId: string) => {
    navigate(`/clip/${clipId}`);
  };

  const handleBookmarkToggle = async (clipId: string, isBookmarked: boolean) => {
    try {
      if (isBookmarked) {
        await unbookmarkClip.mutateAsync(clipId);
      } else {
        await bookmarkClip.mutateAsync(clipId);
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleAddToCourse = (clipId: string) => {
    // Navigate to course builder with this clip pre-selected
    navigate(`/course-builder?addClip=${clipId}`);
  };

  const handleShare = () => {
    // Implement share functionality
    toast.success('Share link copied to clipboard!');
  };

  const handleDownload = () => {
    // Implement download functionality
    toast.success('Download started!');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSkillLevelColor = (level: SkillLevel) => {
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

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.machine_models?.length) count += filters.machine_models.length;
    if (filters.processes?.length) count += filters.processes.length;
    if (filters.tags?.length) count += filters.tags.length;
    if (filters.skill_levels?.length) count += filters.skill_levels.length;
    if (filters.authors?.length) count += filters.authors.length;
    if (filters.duration_range) count += 1;
    if (filters.date_range) count += 1;
    return count;
  };

  const toggleFilterSection = (section: keyof typeof expandedFilterSections) => {
    setExpandedFilterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock facets data - in real app, this would come from the API
  const facets = {
    machine_models: [
      { value: 'cnc-mill', count: 45, label: 'CNC Mill' },
      { value: 'cnc-lathe', count: 32, label: 'CNC Lathe' },
      { value: 'press-brake', count: 28, label: 'Press Brake' },
      { value: 'laser-cutter', count: 22, label: 'Laser Cutter' },
    ],
    processes: [
      { value: 'milling', count: 38, label: 'Milling' },
      { value: 'turning', count: 25, label: 'Turning' },
      { value: 'bending', count: 18, label: 'Bending' },
      { value: 'cutting', count: 15, label: 'Cutting' },
    ],
    tags: [
      { value: 'safety', count: 42, label: 'Safety' },
      { value: 'maintenance', count: 35, label: 'Maintenance' },
      { value: 'setup', count: 28, label: 'Setup' },
      { value: 'troubleshooting', count: 20, label: 'Troubleshooting' },
    ],
    skill_levels: [
      { value: 'beginner' as SkillLevel, count: 30, label: 'Beginner' },
      { value: 'intermediate' as SkillLevel, count: 45, label: 'Intermediate' },
      { value: 'advanced' as SkillLevel, count: 25, label: 'Advanced' },
      { value: 'expert' as SkillLevel, count: 15, label: 'Expert' },
    ],
    authors: [
      { value: 'john-doe', count: 20, label: 'John Doe' },
      { value: 'jane-smith', count: 18, label: 'Jane Smith' },
      { value: 'mike-wilson', count: 15, label: 'Mike Wilson' },
      { value: 'sarah-jones', count: 12, label: 'Sarah Jones' },
    ]
  };

  const ClipCard: React.FC<{ clip: Clip }> = ({ clip }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary/20">
        <div className="relative aspect-video bg-muted">
          <img
            src={clip.thumbnail_url}
            alt={clip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Button
              size="icon"
              className="bg-white/20 hover:bg-white/30 text-white rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleClipClick(clip.id);
              }}
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/60 text-white">
              {formatDuration(clip.duration)}
            </Badge>
          </div>
          {/* Auto-generated captions indicator */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="bg-white/90 text-gray-700 text-xs">
              CC
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {clip.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {clip.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="outline" className="text-xs">
              {clip.machine_model}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {clip.process}
            </Badge>
            <Badge className={`text-xs border ${getSkillLevelColor(clip.skill_level as SkillLevel)}`}>
              {clip.skill_level}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>By {clip.author.name || 'Unknown'}</span>
            <span>{clip.view_count} views</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkToggle(clip.id, false); // Assuming not bookmarked for now
              }}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCourse(clip.id);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const ClipListItem: React.FC<{ clip: Clip }> = ({ clip }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary/20 mb-4">
        <div className="flex">
          <div className="relative w-48 h-32 bg-muted flex-shrink-0">
            <img
              src={clip.thumbnail_url}
              alt={clip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button
                size="icon"
                className="bg-white/20 hover:bg-white/30 text-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClipClick(clip.id);
                }}
              >
                <Play className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/60 text-white">
                {formatDuration(clip.duration)}
              </Badge>
            </div>
            {/* Auto-generated captions indicator */}
            <div className="absolute bottom-2 left-2">
              <Badge variant="outline" className="bg-white/90 text-gray-700 text-xs">
                CC
              </Badge>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {clip.title}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkToggle(clip.id, false);
                  }}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCourse(clip.id);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                >
                  <Share className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-3 line-clamp-2">
              {clip.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="outline" className="text-xs">
                {clip.machine_model}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {clip.process}
              </Badge>
              <Badge className={`text-xs border ${getSkillLevelColor(clip.skill_level as SkillLevel)}`}>
                {clip.skill_level}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>By {clip.author.name || 'Unknown'}</span>
              <span>{clip.view_count} views</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Content Library</h1>
          <p className="text-muted-foreground text-lg">
            Search and browse through our collection of training clips
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search clips by title, machine model, process, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card border rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <div className="flex items-center gap-2">
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary">
                        {getActiveFiltersCount()} active
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                    >
                      Clear all
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Machine Models */}
                  <div>
                    <Card>
                      <CardHeader 
                        className="pb-3 cursor-pointer"
                        onClick={() => toggleFilterSection('machine_models')}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Machine Models</CardTitle>
                          {expandedFilterSections.machine_models ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {expandedFilterSections.machine_models && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="pt-0">
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {facets.machine_models.map((item) => (
                                  <div
                                    key={item.value}
                                    className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                                    onClick={() => {
                                      const newValues = filters.machine_models?.includes(item.value)
                                        ? filters.machine_models.filter(v => v !== item.value)
                                        : [...(filters.machine_models || []), item.value];
                                      updateFilter('machine_models', newValues);
                                    }}
                                  >
                                    <Checkbox
                                      checked={filters.machine_models?.includes(item.value) || false}
                                      onChange={() => {
                                        const newValues = filters.machine_models?.includes(item.value)
                                          ? filters.machine_models.filter(v => v !== item.value)
                                          : [...(filters.machine_models || []), item.value];
                                        updateFilter('machine_models', newValues);
                                      }}
                                    />
                                    <span className="text-sm flex-1">{item.label}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {item.count}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </div>

                  {/* Processes */}
                  <div>
                    <Card>
                      <CardHeader 
                        className="pb-3 cursor-pointer"
                        onClick={() => toggleFilterSection('processes')}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Processes</CardTitle>
                          {expandedFilterSections.processes ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {expandedFilterSections.processes && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="pt-0">
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {facets.processes.map((item) => (
                                  <div
                                    key={item.value}
                                    className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                                    onClick={() => {
                                      const newValues = filters.processes?.includes(item.value)
                                        ? filters.processes.filter(v => v !== item.value)
                                        : [...(filters.processes || []), item.value];
                                      updateFilter('processes', newValues);
                                    }}
                                  >
                                    <Checkbox
                                      checked={filters.processes?.includes(item.value) || false}
                                      onChange={() => {
                                        const newValues = filters.processes?.includes(item.value)
                                          ? filters.processes.filter(v => v !== item.value)
                                          : [...(filters.processes || []), item.value];
                                        updateFilter('processes', newValues);
                                      }}
                                    />
                                    <span className="text-sm flex-1">{item.label}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {item.count}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </div>

                  {/* Skill Levels */}
                  <div>
                    <Card>
                      <CardHeader 
                        className="pb-3 cursor-pointer"
                        onClick={() => toggleFilterSection('skill_levels')}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Skill Levels</CardTitle>
                          {expandedFilterSections.skill_levels ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {expandedFilterSections.skill_levels && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="pt-0">
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {facets.skill_levels.map((item) => (
                                  <div
                                    key={item.value}
                                    className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                                    onClick={() => {
                                      const newValues = filters.skill_levels?.includes(item.value)
                                        ? filters.skill_levels.filter(v => v !== item.value)
                                        : [...(filters.skill_levels || []), item.value];
                                      updateFilter('skill_levels', newValues);
                                    }}
                                  >
                                    <Checkbox
                                      checked={filters.skill_levels?.includes(item.value) || false}
                                      onChange={() => {
                                        const newValues = filters.skill_levels?.includes(item.value)
                                          ? filters.skill_levels.filter(v => v !== item.value)
                                          : [...(filters.skill_levels || []), item.value];
                                        updateFilter('skill_levels', newValues);
                                      }}
                                    />
                                    <span className="text-sm flex-1">{item.label}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {item.count}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </div>

                  {/* Duration Range */}
                  <div>
                    <Card>
                      <CardHeader 
                        className="pb-3 cursor-pointer"
                        onClick={() => toggleFilterSection('duration')}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Duration</CardTitle>
                          {expandedFilterSections.duration ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {expandedFilterSections.duration && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="pt-0">
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm text-muted-foreground">
                                    {filters.duration_range?.min || 0} - {filters.duration_range?.max || 300} seconds
                                  </label>
                                  <Slider
                                    value={[filters.duration_range?.min || 0, filters.duration_range?.max || 300]}
                                    onValueChange={([min, max]) => updateFilter('duration_range', { min, max })}
                                    max={300}
                                    step={5}
                                    className="mt-2"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </div>

                  {/* Date Range */}
                  <div>
                    <Card>
                      <CardHeader 
                        className="pb-3 cursor-pointer"
                        onClick={() => toggleFilterSection('date_range')}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Date Range</CardTitle>
                          {expandedFilterSections.date_range ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {expandedFilterSections.date_range && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="pt-0">
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm text-muted-foreground mb-1 block">From</label>
                                  <Input
                                    type="date"
                                    value={filters.date_range?.start || ''}
                                    onChange={(e) => updateFilter('date_range', {
                                      ...filters.date_range,
                                      start: e.target.value
                                    })}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-muted-foreground mb-1 block">To</label>
                                  <Input
                                    type="date"
                                    value={filters.date_range?.end || ''}
                                    onChange={(e) => updateFilter('date_range', {
                                      ...filters.date_range,
                                      end: e.target.value
                                    })}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="most_viewed">Most Viewed</SelectItem>
                    <SelectItem value="recommended">Recommended</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 w-full"></div>
              </div>
            ))}
          </div>
        ) : sortedClips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No clips found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {paginatedClips.map((clip) => (
                viewMode === 'grid' ? (
                  <ClipCard key={clip.id} clip={clip} />
                ) : (
                  <ClipListItem key={clip.id} clip={clip} />
                )
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Showing {startIndex + 1} to {Math.min(endIndex, sortedClips.length)} of {sortedClips.length} clips
                  </span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 per page</SelectItem>
                      <SelectItem value="24">24 per page</SelectItem>
                      <SelectItem value="48">48 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentLibraryBrowse;