import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { toast } from 'sonner';
import type { Course, CourseModule, CourseNode } from '@/types';

// Query keys
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: any) => [...courseKeys.lists(), { filters }] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  progress: (id: string) => [...courseKeys.all, 'progress', id] as const,
  certificate: (id: string) => [...courseKeys.all, 'certificate', id] as const,
};

// Get all courses
export const useCourses = (filters?: any) => {
  return useQuery({
    queryKey: courseKeys.list(filters || {}),
    queryFn: () => coursesApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get course by ID
export const useCourse = (id: string) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
  });
};

// Get course progress
export const useCourseProgress = (id: string) => {
  return useQuery({
    queryKey: courseKeys.progress(id),
    queryFn: () => coursesApi.getProgress(id),
    enabled: !!id,
  });
};

// Get course certificate
export const useCourseCertificate = (id: string) => {
  return useQuery({
    queryKey: courseKeys.certificate(id),
    queryFn: () => coursesApi.getCertificate(id),
    enabled: !!id,
  });
};

// Create course mutation
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.create,
    onSuccess: (newCourse: Course) => {
      // Invalidate and refetch courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      
      // Add the new course to the cache
      queryClient.setQueryData(courseKeys.detail(newCourse.id), newCourse);
      
      toast.success('Course created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create course: ${error.message}`);
    },
  });
};

// Update course mutation
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Course> }) =>
      coursesApi.update(id, updates),
    onSuccess: (updatedCourse: Course) => {
      // Update the course in the cache
      queryClient.setQueryData(courseKeys.detail(updatedCourse.id), updatedCourse);
      
      // Invalidate courses list to ensure consistency
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      
      toast.success('Course updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update course: ${error.message}`);
    },
  });
};

// Delete course mutation
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the course from the cache
      queryClient.removeQueries({ queryKey: courseKeys.detail(deletedId) });
      
      // Invalidate courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      
      toast.success('Course deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete course: ${error.message}`);
    },
  });
};

// Enroll in course mutation
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.enroll,
    onSuccess: (_, courseId) => {
      // Invalidate course progress
      queryClient.invalidateQueries({ queryKey: courseKeys.progress(courseId) });
      
      // Invalidate course details to reflect enrollment status
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      
      toast.success('Successfully enrolled in course!');
    },
    onError: (error: any) => {
      toast.error(`Failed to enroll in course: ${error.message}`);
    },
  });
};

// Unenroll from course mutation
export const useUnenrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.unenroll,
    onSuccess: (_, courseId) => {
      // Invalidate course progress
      queryClient.invalidateQueries({ queryKey: courseKeys.progress(courseId) });
      
      // Invalidate course details to reflect enrollment status
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      
      toast.success('Successfully unenrolled from course!');
    },
    onError: (error: any) => {
      toast.error(`Failed to unenroll from course: ${error.message}`);
    },
  });
};

// Update course progress mutation
export const useUpdateCourseProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: any }) =>
      coursesApi.updateProgress(id, progress),
    onSuccess: (_, { id }) => {
      // Invalidate course progress
      queryClient.invalidateQueries({ queryKey: courseKeys.progress(id) });
      
      // Invalidate course details to reflect progress
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(id) });
    },
    onError: (error: any) => {
      toast.error(`Failed to update progress: ${error.message}`);
    },
  });
};

// Course builder mutations
export const useAddCourseModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, module }: { courseId: string; module: Omit<CourseModule, 'id'> }) => {
      // This would be implemented in the API layer
      return coursesApi.update(courseId, { 
        modules: [{ ...module, id: Date.now().toString() }] 
      });
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      toast.success('Module added successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to add module: ${error.message}`);
    },
  });
};

export const useAddCourseNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, node }: { 
      courseId: string; 
      moduleId: string; 
      node: Omit<CourseNode, 'id'> 
    }) => {
      // This would be implemented in the API layer
      return coursesApi.update(courseId, { 
        modules: [{ 
          id: moduleId, 
          nodes: [{ ...node, id: Date.now().toString() }] 
        }] 
      });
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      toast.success('Node added successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to add node: ${error.message}`);
    },
  });
};

export const useReorderCourseContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, modules }: { courseId: string; modules: CourseModule[] }) =>
      coursesApi.update(courseId, { modules }),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      toast.success('Course content reordered successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to reorder content: ${error.message}`);
    },
  });
};