export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  total: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface JobStatus {
  id: string;
  type: 'transcode' | 'transcribe' | 'thumbnail' | 'virus_scan' | 'export';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  result?: Record<string, any>;
}

export interface FileUpload {
  file: File;
  progress: UploadProgress;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  id?: string;
  url?: string;
  error?: string;
}

export interface BatchOperation {
  id: string;
  type: 'bulk_assign' | 'bulk_tag' | 'bulk_archive' | 'bulk_export';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_items: number;
  processed_items: number;
  failed_items: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
  result_url?: string;
}

export interface ExportRequest {
  id: string;
  type: 'clips' | 'courses' | 'users' | 'analytics' | 'certificates';
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  filters: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_url?: string;
  expires_at?: string;
  created_at: string;
  completed_at?: string;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  created_at: string;
  last_delivery?: string;
  failure_count: number;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retry_after?: number;
}

export interface ApiHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  services: ServiceHealth[];
  timestamp: string;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  response_time?: number;
  error?: string;
}

export interface ApiMetrics {
  requests_per_minute: number;
  average_response_time: number;
  error_rate: number;
  active_users: number;
  storage_used: number;
  bandwidth_used: number;
}

export interface CacheInfo {
  hit_rate: number;
  miss_rate: number;
  total_requests: number;
  cache_size: number;
  eviction_count: number;
}

export interface ApiVersion {
  version: string;
  deprecated: boolean;
  sunset_date?: string;
  changelog: string[];
}

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  rollout_percentage: number;
  conditions: Record<string, any>;
}

export interface MaintenanceWindow {
  id: string;
  start_time: string;
  end_time: string;
  description: string;
  affected_services: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
}