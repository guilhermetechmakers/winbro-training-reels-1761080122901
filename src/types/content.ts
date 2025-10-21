import type { User } from './auth';

export interface Clip {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnail_url: string;
  video_url: string;
  hls_url: string;
  machine_model: string;
  process: string;
  tooling: string[];
  tags: string[];
  skill_level: SkillLevel;
  author_id: string;
  author: User;
  status: ContentStatus;
  customer_assignments: string[]; // organization IDs
  transcript: TranscriptSegment[];
  metadata: ClipMetadata;
  created_at: string;
  updated_at: string;
  published_at?: string;
  view_count: number;
  bookmark_count: number;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type ContentStatus = 'draft' | 'review' | 'published' | 'archived' | 'rejected';

export interface TranscriptSegment {
  id: string;
  start_time: number; // in seconds
  end_time: number; // in seconds
  text: string;
  confidence: number; // 0-1
  speaker?: string;
}

export interface ClipMetadata {
  resolution: string;
  frame_rate: number;
  bitrate: number;
  codec: string;
  file_size: number;
  duration_original: number;
  processing_status: ProcessingStatus;
  virus_scan_status: 'clean' | 'infected' | 'pending' | 'error';
  moderation_flags: ModerationFlag[];
}

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ModerationFlag {
  id: string;
  type: 'inappropriate_content' | 'copyright' | 'quality' | 'accuracy' | 'other';
  reason: string;
  flagged_by: string;
  flagged_at: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolution_notes?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  author_id: string;
  author: User;
  status: ContentStatus;
  customer_assignments: string[];
  modules: CourseModule[];
  settings: CourseSettings;
  created_at: string;
  updated_at: string;
  published_at?: string;
  enrollment_count: number;
  completion_rate: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  nodes: CourseNode[];
  is_required: boolean;
  estimated_duration: number; // in minutes
}

export interface CourseNode {
  id: string;
  type: 'clip' | 'quiz';
  order: number;
  clip_id?: string;
  clip?: Clip;
  quiz?: Quiz;
  is_required: boolean;
  estimated_duration: number;
}

export interface CourseSettings {
  passing_threshold: number; // percentage
  max_attempts: number;
  certificate_template_id?: string;
  is_self_paced: boolean;
  due_date?: string;
  prerequisites: string[]; // course IDs
  visibility: 'public' | 'private' | 'organization';
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  settings: QuizSettings;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'true_false';
  question: string;
  options?: string[]; // for multiple choice
  correct_answer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

export interface QuizSettings {
  time_limit?: number; // in minutes
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_correct_answers: boolean;
  allow_review: boolean;
  max_attempts: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  course_id?: string;
  answers: QuizAnswer[];
  score: number;
  max_score: number;
  percentage: number;
  time_taken: number; // in seconds
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
}

export interface QuizAnswer {
  question_id: string;
  answer: string | string[];
  is_correct: boolean;
  points_earned: number;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  template_id: string;
  issued_at: string;
  expires_at?: string;
  verification_url: string;
  qr_code: string;
  pdf_url: string;
  metadata: CertificateMetadata;
}

export interface CertificateMetadata {
  user_name: string;
  course_title: string;
  completion_date: string;
  score: number;
  organization_name?: string;
  custom_fields: Record<string, any>;
}

export interface Bookmark {
  id: string;
  user_id: string;
  clip_id: string;
  clip: Clip;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  clip_id: string;
  content: string;
  timestamp?: number; // in seconds
  is_public: boolean;
  mentions: string[]; // user IDs
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  clip_id: string;
  content: string;
  parent_id?: string; // for replies
  replies: Comment[];
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  query?: string;
  machine_models?: string[];
  processes?: string[];
  tags?: string[];
  skill_levels?: SkillLevel[];
  authors?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  duration_range?: {
    min: number;
    max: number;
  };
  status?: ContentStatus[];
}

export interface SearchResult {
  clips: Clip[];
  courses: Course[];
  total: number;
  facets: SearchFacets;
  suggestions: string[];
}

export interface SearchFacets {
  machine_models: FacetItem[];
  processes: FacetItem[];
  tags: FacetItem[];
  skill_levels: FacetItem[];
  authors: FacetItem[];
}

export interface FacetItem {
  value: string;
  count: number;
  label: string;
}

// Quiz Results and Certificate Page Types
export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id: string;
  course_id?: string;
  attempt_id: string;
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  attempts_used: number;
  max_attempts: number;
  attempts_remaining: number;
  time_taken: number; // in seconds
  completed_at: string;
  questions: QuizResultQuestion[];
  certificate_eligible: boolean;
  certificate_id?: string;
}

export interface QuizResultQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'short_answer' | 'true_false';
  user_answer: string | string[];
  correct_answer: string | string[];
  is_correct: boolean;
  points_earned: number;
  max_points: number;
  explanation?: string;
  remediation_clip_id?: string;
  remediation_clip?: Clip;
}

export interface CertificateResult {
  id: string;
  certificate_number: string;
  user_name: string;
  course_title: string;
  completion_date: string;
  score: number;
  percentage: number;
  issued_at: string;
  expires_at?: string;
  verification_url: string;
  qr_code: string;
  pdf_url: string;
  share_url: string;
  organization_name?: string;
  template_id: string;
  custom_fields: Record<string, any>;
}

export interface RetakeOptions {
  allowed: boolean;
  available_at?: string;
  cooldown_hours?: number;
  max_attempts: number;
  attempts_used: number;
  next_attempt_allowed: boolean;
  reason?: string;
}