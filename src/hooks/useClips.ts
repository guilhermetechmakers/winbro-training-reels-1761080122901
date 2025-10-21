import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clipsApi } from '@/lib/api';
import { toast } from 'sonner';
import type { Clip, SearchFilters } from '@/types';

// Query keys
export const clipKeys = {
  all: ['clips'] as const,
  lists: () => [...clipKeys.all, 'list'] as const,
  list: (filters: SearchFilters) => [...clipKeys.lists(), { filters }] as const,
  details: () => [...clipKeys.all, 'detail'] as const,
  detail: (id: string) => [...clipKeys.details(), id] as const,
  search: (query: string, filters: SearchFilters) => [...clipKeys.all, 'search', { query, filters }] as const,
  bookmarks: () => [...clipKeys.all, 'bookmarks'] as const,
  notes: (id: string) => [...clipKeys.all, 'notes', id] as const,
};

// Get all clips
export const useClips = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: clipKeys.list(filters || {}),
    queryFn: () => clipsApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get clip by ID
export const useClip = (id: string) => {
  return useQuery({
    queryKey: clipKeys.detail(id),
    queryFn: () => clipsApi.getById(id),
    enabled: !!id,
  });
};

// Search clips
export const useSearchClips = (query: string, filters?: SearchFilters) => {
  return useQuery({
    queryKey: clipKeys.search(query, filters || {}),
    queryFn: () => clipsApi.search(query, filters),
    enabled: !!query,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get bookmarked clips
export const useBookmarkedClips = () => {
  return useQuery({
    queryKey: clipKeys.bookmarks(),
    queryFn: () => clipsApi.getAll({ bookmarked: true }),
    staleTime: 1000 * 60 * 5,
  });
};

// Get clip notes
export const useClipNotes = (clipId: string) => {
  return useQuery({
    queryKey: clipKeys.notes(clipId),
    queryFn: () => clipsApi.getNotes(clipId),
    enabled: !!clipId,
  });
};

// Create clip mutation
export const useCreateClip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clipsApi.create,
    onSuccess: (newClip: Clip) => {
      // Invalidate and refetch clips list
      queryClient.invalidateQueries({ queryKey: clipKeys.lists() });
      
      // Add the new clip to the cache
      queryClient.setQueryData(clipKeys.detail(newClip.id), newClip);
      
      toast.success('Clip created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create clip: ${error.message}`);
    },
  });
};

// Update clip mutation
export const useUpdateClip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Clip> }) =>
      clipsApi.update(id, updates),
    onSuccess: (updatedClip: Clip) => {
      // Update the clip in the cache
      queryClient.setQueryData(clipKeys.detail(updatedClip.id), updatedClip);
      
      // Invalidate clips list to ensure consistency
      queryClient.invalidateQueries({ queryKey: clipKeys.lists() });
      
      toast.success('Clip updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update clip: ${error.message}`);
    },
  });
};

// Delete clip mutation
export const useDeleteClip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clipsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the clip from the cache
      queryClient.removeQueries({ queryKey: clipKeys.detail(deletedId) });
      
      // Invalidate clips list
      queryClient.invalidateQueries({ queryKey: clipKeys.lists() });
      
      toast.success('Clip deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete clip: ${error.message}`);
    },
  });
};

// Upload clip mutation
export const useUploadClip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) =>
      clipsApi.upload(file, onProgress),
    onSuccess: (newClip: Clip) => {
      // Invalidate and refetch clips list
      queryClient.invalidateQueries({ queryKey: clipKeys.lists() });
      
      // Add the new clip to the cache
      queryClient.setQueryData(clipKeys.detail(newClip.id), newClip);
      
      toast.success('Clip uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });
};

// Bookmark clip mutation
export const useBookmarkClip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clipsApi.bookmark,
    onSuccess: (_, clipId) => {
      // Invalidate bookmarks list
      queryClient.invalidateQueries({ queryKey: clipKeys.bookmarks() });
      
      // Update the clip in cache to reflect bookmark status
      queryClient.invalidateQueries({ queryKey: clipKeys.detail(clipId) });
      
      toast.success('Clip bookmarked!');
    },
    onError: (error: any) => {
      toast.error(`Failed to bookmark clip: ${error.message}`);
    },
  });
};

// Unbookmark clip mutation
export const useUnbookmarkClip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clipsApi.unbookmark,
    onSuccess: (_, clipId) => {
      // Invalidate bookmarks list
      queryClient.invalidateQueries({ queryKey: clipKeys.bookmarks() });
      
      // Update the clip in cache to reflect bookmark status
      queryClient.invalidateQueries({ queryKey: clipKeys.detail(clipId) });
      
      toast.success('Bookmark removed!');
    },
    onError: (error: any) => {
      toast.error(`Failed to remove bookmark: ${error.message}`);
    },
  });
};

// Add note mutation
export const useAddClipNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clipId, content, timestamp }: { clipId: string; content: string; timestamp?: number }) =>
      clipsApi.addNote(clipId, content, timestamp),
    onSuccess: (_, { clipId }) => {
      // Invalidate clip notes
      queryClient.invalidateQueries({ queryKey: clipKeys.notes(clipId) });
      
      toast.success('Note added successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to add note: ${error.message}`);
    },
  });
};

// Report clip mutation
export const useReportClip = () => {
  return useMutation({
    mutationFn: ({ clipId, reason, description }: { clipId: string; reason: string; description?: string }) =>
      clipsApi.report(clipId, reason, description),
    onSuccess: () => {
      toast.success('Report submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to submit report: ${error.message}`);
    },
  });
};