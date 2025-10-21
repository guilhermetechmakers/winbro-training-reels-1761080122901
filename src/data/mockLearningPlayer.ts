import type { LearningPlayerCourse, Clip, Quiz } from '@/types/content';

export const mockClip: Clip = {
  id: 'clip-1',
  title: 'Safety Overview Video',
  description: 'Introduction to manufacturing safety protocols',
  duration: 180,
  thumbnail_url: '/api/placeholder/400/225',
  video_url: '/api/videos/safety-overview.mp4',
  hls_url: '/api/videos/safety-overview.m3u8',
  machine_model: 'CNC-2000',
  process: 'Safety Training',
  tooling: ['Safety Glasses', 'Hard Hat'],
  tags: ['safety', 'introduction', 'basics'],
  skill_level: 'beginner',
  author_id: 'author-1',
  author: {
    id: 'author-1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@winbro.com',
    avatar_url: '/api/placeholder/40/40',
    role: 'trainer',
    is_verified: true,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  status: 'published',
  customer_assignments: ['org-1'],
  transcript: [
    {
      id: 't1',
      start_time: 0,
      end_time: 30,
      text: 'Welcome to our safety training program.',
      confidence: 0.95,
      speaker: 'Dr. Sarah Johnson'
    },
    {
      id: 't2',
      start_time: 30,
      end_time: 60,
      text: 'Today we will cover the essential safety protocols.',
      confidence: 0.92,
      speaker: 'Dr. Sarah Johnson'
    }
  ],
  metadata: {
    resolution: '1920x1080',
    frame_rate: 30,
    bitrate: 2500000,
    codec: 'H.264',
    file_size: 15728640,
    duration_original: 180,
    processing_status: 'completed',
    virus_scan_status: 'clean',
    moderation_flags: []
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  published_at: '2024-01-01T00:00:00Z',
  view_count: 150,
  bookmark_count: 25
};

export const mockQuiz: Quiz = {
  id: 'quiz-1',
  title: 'Safety Knowledge Check',
  description: 'Basic safety knowledge assessment',
  questions: [
    {
      id: 'q1',
      type: 'multiple_choice',
      question: 'What is the first thing you should do when entering a manufacturing facility?',
      options: [
        'Check your phone',
        'Put on safety equipment',
        'Start working immediately',
        'Take a break'
      ],
      correct_answer: 'Put on safety equipment',
      explanation: 'Safety equipment must be worn at all times in manufacturing facilities.',
      points: 10,
      order: 1
    },
    {
      id: 'q2',
      type: 'true_false',
      question: 'It is acceptable to remove safety glasses when working with machinery.',
      correct_answer: 'false',
      explanation: 'Safety glasses must be worn at all times when working with machinery.',
      points: 10,
      order: 2
    },
    {
      id: 'q3',
      type: 'short_answer',
      question: 'What does PPE stand for?',
      correct_answer: 'Personal Protective Equipment',
      explanation: 'PPE stands for Personal Protective Equipment.',
      points: 10,
      order: 3
    }
  ],
  settings: {
    time_limit: 10,
    shuffle_questions: false,
    shuffle_options: false,
    show_correct_answers: true,
    allow_review: true,
    max_attempts: 3
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockLearningPlayerCourse: LearningPlayerCourse = {
  id: 'course-1',
  title: 'Advanced Manufacturing Safety Protocols',
  description: 'Comprehensive training on safety protocols for advanced manufacturing equipment',
  thumbnail_url: '/api/placeholder/400/225',
  author: {
    id: 'author-1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@winbro.com',
    avatar_url: '/api/placeholder/40/40',
    role: 'trainer',
    is_verified: true,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  modules: [
    {
      id: 'module-1',
      title: 'Introduction to Safety Standards',
      description: 'Overview of manufacturing safety standards and regulations',
      order: 1,
      nodes: [
        {
          id: 'node-1',
          type: 'clip',
          order: 1,
          title: 'Safety Overview Video',
          description: 'Introduction to manufacturing safety protocols',
          clip_id: 'clip-1',
          clip: mockClip,
          is_required: true,
          estimated_duration: 3,
          is_completed: true,
          is_locked: false,
          status: 'completed',
          time_spent: 180,
          attempts: 1
        },
        {
          id: 'node-2',
          type: 'quiz',
          order: 2,
          title: 'Safety Knowledge Check',
          description: 'Test your understanding of safety basics',
          quiz: mockQuiz,
          is_required: true,
          estimated_duration: 5,
          is_completed: false,
          is_locked: false,
          status: 'in_progress',
          time_spent: 0,
          attempts: 0
        }
      ],
      is_required: true,
      estimated_duration: 8,
      is_completed: false,
      is_locked: false,
      progress: 50
    },
    {
      id: 'module-2',
      title: 'Equipment-Specific Safety Procedures',
      description: 'Detailed safety procedures for specific manufacturing equipment',
      order: 2,
      nodes: [
        {
          id: 'node-3',
          type: 'clip',
          order: 1,
          title: 'CNC Machine Safety',
          description: 'Safety protocols for CNC machine operation',
          clip_id: 'clip-2',
          is_required: true,
          estimated_duration: 4,
          is_completed: false,
          is_locked: true,
          status: 'locked',
          time_spent: 0,
          attempts: 0
        }
      ],
      is_required: true,
      estimated_duration: 4,
      is_completed: false,
      is_locked: true,
      progress: 0
    }
  ],
  settings: {
    passing_threshold: 80,
    max_attempts: 3,
    certificate_template_id: 'template-1',
    is_self_paced: true,
    prerequisites: [],
    visibility: 'organization'
  },
  total_duration: 12,
  estimated_duration: 12,
  enrollment_count: 150,
  completion_rate: 85,
  prerequisites: [],
  is_enrolled: true,
  enrollment_date: '2024-01-01T00:00:00Z',
  progress: []
};
