import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Course } from '@/types/content';

// Mock data for development
const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Introduction to Manufacturing',
    description: 'Learn the basics of modern manufacturing processes',
    thumbnail_url: '/api/placeholder/300/200',
    author_id: 'user-1',
    author: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar_url: '/api/placeholder/40/40',
      role: 'trainer',
      organization_id: 'org-1',
      is_verified: true,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    status: 'published',
    customer_assignments: ['org-1'],
    modules: [
      {
        id: 'module-1',
        title: 'Safety Basics',
        description: 'Essential safety procedures',
        order: 0,
        nodes: [
          {
            id: 'node-1',
            type: 'clip',
            order: 0,
            is_required: true,
            estimated_duration: 5,
            clip_id: 'clip-1',
            clip: {
              id: 'clip-1',
              title: 'Safety Introduction',
              description: 'Basic safety overview',
              duration: 300,
              thumbnail_url: '/api/placeholder/300/200',
              video_url: '/api/videos/clip-1.mp4',
              hls_url: '/api/videos/clip-1.m3u8',
              machine_model: 'Model A',
              process: 'Safety',
              tooling: ['Safety glasses', 'Hard hat'],
              tags: ['safety', 'introduction'],
              skill_level: 'beginner',
              author_id: 'user-1',
              author: {
                id: 'user-1',
                name: 'John Doe',
                email: 'john@example.com',
                avatar_url: '/api/placeholder/40/40',
                role: 'trainer',
                organization_id: 'org-1',
                is_verified: true,
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
              },
              status: 'published',
              customer_assignments: ['org-1'],
              transcript: [],
              metadata: {
                resolution: '1920x1080',
                frame_rate: 30,
                bitrate: 2000,
                codec: 'h264',
                file_size: 50000000,
                duration_original: 300,
                processing_status: 'completed',
                virus_scan_status: 'clean',
                moderation_flags: []
              },
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              published_at: '2024-01-01T00:00:00Z',
              view_count: 150,
              bookmark_count: 25
            }
          }
        ],
        is_required: true,
        estimated_duration: 5
      }
    ],
    settings: {
      passing_threshold: 80,
      max_attempts: 3,
      certificate_template_id: 'template-1',
      is_self_paced: true,
      due_date: undefined,
      prerequisites: [],
      visibility: 'organization'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    published_at: '2024-01-01T00:00:00Z',
    enrollment_count: 45,
    completion_rate: 0.85
  }
];

export const useCourses = () => {
  const queryClient = useQueryClient();

  // Get all courses
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return mockCourses;
    }
  });

  // Get a single course
  const useCourse = (courseId: string) => {
    return useQuery({
      queryKey: ['courses', courseId],
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockCourses.find(course => course.id === courseId);
      },
      enabled: !!courseId
    });
  };

  // Create course
  const createCourse = useMutation({
    mutationFn: async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCourse: Course = {
        ...courseData,
        id: `course-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockCourses.push(newCourse);
      return newCourse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });

  // Update course
  const updateCourse = useMutation({
    mutationFn: async (courseData: Course) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = mockCourses.findIndex(course => course.id === courseData.id);
      if (index !== -1) {
        mockCourses[index] = {
          ...courseData,
          updated_at: new Date().toISOString()
        };
        return mockCourses[index];
      }
      throw new Error('Course not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });

  // Delete course
  const deleteCourse = useMutation({
    mutationFn: async (courseId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockCourses.findIndex(course => course.id === courseId);
      if (index !== -1) {
        mockCourses.splice(index, 1);
        return true;
      }
      throw new Error('Course not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });

  // Publish course
  const publishCourse = useMutation({
    mutationFn: async ({ courseId, status }: { courseId: string; status: Course['status'] }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const course = mockCourses.find(c => c.id === courseId);
      if (course) {
        course.status = status;
        course.updated_at = new Date().toISOString();
        if (status === 'published') {
          course.published_at = new Date().toISOString();
        }
        return course;
      }
      throw new Error('Course not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });

  return {
    courses,
    isLoading,
    error,
    useCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    publishCourse
  };
};
