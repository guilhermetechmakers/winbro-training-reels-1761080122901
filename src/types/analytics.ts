export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  organization_id?: string;
  event_type: EventType;
  event_data: Record<string, any>;
  timestamp: string;
  session_id: string;
  ip_address?: string;
  user_agent?: string;
}

export type EventType = 
  | 'clip.view'
  | 'clip.bookmark'
  | 'clip.download'
  | 'clip.share'
  | 'clip.report'
  | 'course.start'
  | 'course.complete'
  | 'course.abandon'
  | 'quiz.attempt'
  | 'quiz.complete'
  | 'certificate.issued'
  | 'search.query'
  | 'search.result_click'
  | 'upload.start'
  | 'upload.complete'
  | 'upload.fail'
  | 'user.login'
  | 'user.logout'
  | 'user.signup';

export interface ClipViewEvent {
  clip_id: string;
  duration_watched: number;
  completion_percentage: number;
  quality: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
}

export interface SearchEvent {
  query: string;
  filters: Record<string, any>;
  result_count: number;
  clicked_result_id?: string;
  clicked_result_type?: 'clip' | 'course';
}

export interface CourseProgressEvent {
  course_id: string;
  module_id: string;
  node_id: string;
  progress_percentage: number;
  time_spent: number;
}

export interface DashboardMetrics {
  total_clips: number;
  total_courses: number;
  total_users: number;
  total_certificates: number;
  monthly_views: number;
  monthly_uploads: number;
  search_success_rate: number;
  course_completion_rate: number;
  user_engagement_score: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface ChartData {
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data: TimeSeriesData[];
  x_axis_label?: string;
  y_axis_label?: string;
}

export interface UserEngagementMetrics {
  user_id: string;
  total_clips_watched: number;
  total_courses_completed: number;
  total_time_spent: number; // in minutes
  last_activity: string;
  engagement_score: number;
  favorite_categories: string[];
  learning_path: string[];
}

export interface ContentPerformanceMetrics {
  content_id: string;
  content_type: 'clip' | 'course';
  total_views: number;
  unique_viewers: number;
  average_watch_time: number;
  completion_rate: number;
  bookmark_rate: number;
  share_rate: number;
  search_impressions: number;
  search_clicks: number;
  click_through_rate: number;
}

export interface OrganizationMetrics {
  organization_id: string;
  total_users: number;
  active_users: number;
  total_clips: number;
  total_courses: number;
  total_certificates: number;
  monthly_usage: number;
  storage_used: number; // in GB
  api_calls: number;
  cost: number;
}

export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  type: 'dashboard' | 'content' | 'user' | 'organization' | 'custom';
  filters: Record<string, any>;
  group_by: string[];
  metrics: string[];
  format: 'json' | 'csv' | 'pdf';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    timezone: string;
  };
  recipients: string[];
  created_at: string;
  updated_at: string;
}

export interface ReportResult {
  id: string;
  config_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_url?: string;
  generated_at: string;
  expires_at: string;
  error_message?: string;
}

export interface HeatmapData {
  clip_id: string;
  timestamp: number; // in seconds
  engagement_score: number;
  drop_off_rate: number;
  rewind_count: number;
  forward_count: number;
}

export interface FunnelData {
  step: string;
  users: number;
  conversion_rate: number;
  drop_off_rate: number;
}

export interface LearningPath {
  user_id: string;
  path: LearningStep[];
  total_duration: number;
  completion_percentage: number;
  next_recommended: string[];
}

export interface LearningStep {
  content_id: string;
  content_type: 'clip' | 'course';
  title: string;
  completed: boolean;
  completed_at?: string;
  score?: number;
  time_spent: number;
}