export interface AdminDashboardData {
  kpis: KPIMetrics;
  charts: ChartData[];
  outstandingTasks: OutstandingTask[];
  customers: CustomerSummary[];
  lastUpdated: string;
}

export interface KPIMetrics {
  clipsPublished: number;
  viewsLast30d: number;
  activeUsers: number;
  certificatesIssued: number;
  clipsPublishedChange: number;
  viewsLast30dChange: number;
  activeUsersChange: number;
  certificatesIssuedChange: number;
}

export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'area' | 'pie';
  data: ChartDataPoint[];
  color: string;
  description?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

export interface OutstandingTask {
  id: string;
  type: 'review' | 'flagged' | 'moderation' | 'user_issue';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  createdAt: string;
  dueDate?: string;
  metadata?: Record<string, any>;
}

export interface CustomerSummary {
  id: string;
  name: string;
  organizationId: string;
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  userCount: number;
  clipCount: number;
  courseCount: number;
  lastActivity: string;
  subscriptionTier: 'basic' | 'professional' | 'enterprise';
  storageUsed: number; // in GB
  monthlyUsage: number; // in minutes
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'trainer' | 'learner' | 'customer_admin' | 'reviewer';
  organizationId: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

export interface ContentModerationItem {
  id: string;
  contentId: string;
  contentType: 'clip' | 'course';
  title: string;
  author: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  reportedBy: string;
  reportedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeConnections: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  lastChecked: string;
}

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface AdminDashboardFilters {
  dateRange: {
    start: string;
    end: string;
  };
  organizationId?: string;
  contentType?: 'all' | 'clips' | 'courses';
  status?: 'all' | 'active' | 'inactive' | 'pending';
}

export interface AdminDashboardSettings {
  refreshInterval: number; // in seconds
  autoRefresh: boolean;
  defaultDateRange: '7d' | '30d' | '90d' | '1y';
  chartTypes: {
    [key: string]: 'line' | 'bar' | 'area' | 'pie';
  };
  notifications: {
    email: boolean;
    inApp: boolean;
    webhook: boolean;
  };
}