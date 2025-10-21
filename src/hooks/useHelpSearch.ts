import React, { useState, useCallback, useMemo } from 'react';
import type { HelpSearchResult, HelpSearchFilters, UseHelpSearchReturn } from '@/types/help';

// Mock search data - in a real app, this would come from an API
const mockSearchData: HelpSearchResult[] = [
  {
    id: '1',
    type: 'faq',
    title: 'How do I upload a new training clip?',
    content: 'To upload a new training clip, navigate to the Upload page from your dashboard...',
    category: 'Upload',
    tags: ['upload', 'video', 'metadata'],
    relevance_score: 0.95,
    url: '/help#faq-1'
  },
  {
    id: '2',
    type: 'article',
    title: 'Best Practices for Recording Training Videos',
    content: 'Creating effective training videos requires careful planning and execution...',
    category: 'Content Creation',
    tags: ['recording', 'video', 'best-practices'],
    relevance_score: 0.88,
    url: '/help#article-2'
  },
  {
    id: '3',
    type: 'step',
    title: 'Set Up Your Recording Environment',
    content: 'Position your camera or phone to capture the most important details...',
    category: 'Onboarding',
    tags: ['setup', 'recording', 'environment'],
    relevance_score: 0.82,
    url: '/help#step-3'
  },
  {
    id: '4',
    type: 'faq',
    title: 'What video formats are supported?',
    content: 'We support MP4, MOV, and AVI formats. For best results, use MP4 with H.264 encoding...',
    category: 'Technical',
    tags: ['formats', 'video', 'transcoding'],
    relevance_score: 0.79,
    url: '/help#faq-4'
  },
  {
    id: '5',
    type: 'article',
    title: 'Creating Effective Course Structures',
    content: 'A well-structured course helps learners progress logically through material...',
    category: 'Course Building',
    tags: ['course', 'structure', 'learning'],
    relevance_score: 0.75,
    url: '/help#article-5'
  }
];

export const useHelpSearch = (): UseHelpSearchReturn => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<HelpSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string, filters?: HelpSearchFilters): Promise<void> => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter and search through mock data
      let filteredResults = mockSearchData.filter(item => {
        const matchesQuery = 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesQuery) return false;

        // Apply additional filters
        if (filters?.type && filters.type.length > 0) {
          if (!filters.type.includes(item.type)) return false;
        }

        if (filters?.category && filters.category.length > 0) {
          if (!filters.category.includes(item.category)) return false;
        }

        if (filters?.tags && filters.tags.length > 0) {
          if (!filters.tags.some(tag => item.tags.includes(tag))) return false;
        }

        return true;
      });

      // Sort by relevance score
      filteredResults.sort((a, b) => b.relevance_score - a.relevance_score);

      setResults(filteredResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  // Auto-search when query changes
  const debouncedSearch = useMemo(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        search(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return debouncedSearch;
  }, [debouncedSearch]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search,
    clear
  };
};