import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import type { 
  AdminDashboardFilters 
} from '@/types/admin';

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  kpis: () => [...adminKeys.all, 'kpis'] as const,
  charts: (type: string) => [...adminKeys.all, 'charts', type] as const,
  tasks: () => [...adminKeys.all, 'tasks'] as const,
  customers: () => [...adminKeys.all, 'customers'] as const,
  health: () => [...adminKeys.all, 'health'] as const,
  notifications: () => [...adminKeys.all, 'notifications'] as const,
  moderation: () => [...adminKeys.all, 'moderation'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  organizationMetrics: (orgId: string) => [...adminKeys.all, 'organization-metrics', orgId] as const,
  contentPerformance: (contentId: string) => [...adminKeys.all, 'content-performance', contentId] as const,
  searchAnalytics: () => [...adminKeys.all, 'search-analytics'] as const,
  uploadAnalytics: () => [...adminKeys.all, 'upload-analytics'] as const,
  certificateAnalytics: () => [...adminKeys.all, 'certificate-analytics'] as const,
  auditLogs: () => [...adminKeys.all, 'audit-logs'] as const,
  systemMetrics: () => [...adminKeys.all, 'system-metrics'] as const,
};

// Admin Dashboard Data
export const useAdminDashboard = (_filters?: AdminDashboardFilters) => {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminApi.getDashboard(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2, // 2 minutes
  });
};

// KPI Metrics
export const useKPIs = () => {
  return useQuery({
    queryKey: adminKeys.kpis(),
    queryFn: () => adminApi.getKPIs(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2, // 2 minutes
  });
};

// Charts Data
export const useCharts = (type: string, params?: any) => {
  return useQuery({
    queryKey: adminKeys.charts(type),
    queryFn: () => adminApi.getCharts(type, params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2, // 2 minutes
  });
};

// Outstanding Tasks
export const useOutstandingTasks = (params?: any) => {
  return useQuery({
    queryKey: adminKeys.tasks(),
    queryFn: () => adminApi.getOutstandingTasks(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 1, // 1 minute
  });
};

// Customers
export const useCustomers = (params?: any) => {
  return useQuery({
    queryKey: adminKeys.customers(),
    queryFn: () => adminApi.getCustomers(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// System Health
export const useSystemHealth = () => {
  return useQuery({
    queryKey: adminKeys.health(),
    queryFn: () => adminApi.getSystemHealth(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // 30 seconds
  });
};

// Notifications
export const useAdminNotifications = (params?: any) => {
  return useQuery({
    queryKey: adminKeys.notifications(),
    queryFn: () => adminApi.getNotifications(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 1, // 1 minute
  });
};

// Moderation Queue
export const useModerationQueue = (params?: any) => {
  return useQuery({
    queryKey: adminKeys.moderation(),
    queryFn: () => adminApi.getModerationQueue(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 1, // 1 minute
  });
};

// Admin Users
export const useAdminUsers = (params?: any) => {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: () => adminApi.getUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Organization Metrics
export const useOrganizationMetrics = (orgId: string) => {
  return useQuery({
    queryKey: adminKeys.organizationMetrics(orgId),
    queryFn: () => adminApi.getOrganizationMetrics(orgId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!orgId,
  });
};

// Content Performance
export const useContentPerformance = (contentId: string) => {
  return useQuery({
    queryKey: adminKeys.contentPerformance(contentId),
    queryFn: () => adminApi.getContentPerformance(contentId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!contentId,
  });
};

// Search Analytics
export const useSearchAnalytics = (params?: any) => {
  return useQuery({
    queryKey: adminKeys.searchAnalytics(),
    queryFn: () => adminApi.getSearchAnalytics(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Upload Analytics
export const useUploadAnalytics = (params?: any) => {
  return useQuery({
    queryKey: adminKeys.uploadAnalytics(),
    queryFn: () => adminApi.getUploadAnalytics(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Certificate Analytics
export const useCertificateAnalytics = (params?: any) => {
  return useQuery({
    queryKey: adminKeys.certificateAnalytics(),
    queryFn: () => adminApi.getCertificateAnalytics(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Audit Logs
export const useAuditLogs = (params?: any) => {
  return useQuery({
    queryKey: adminKeys.auditLogs(),
    queryFn: () => adminApi.getAuditLogs(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// System Metrics
export const useSystemMetrics = () => {
  return useQuery({
    queryKey: adminKeys.systemMetrics(),
    queryFn: () => adminApi.getSystemMetrics(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // 30 seconds
  });
};

// Mutations
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.notifications() });
    },
  });
};

export const useModerateContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, action, notes }: { id: string; action: string; notes?: string }) =>
      adminApi.moderateContent(id, action, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.moderation() });
      queryClient.invalidateQueries({ queryKey: adminKeys.tasks() });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      adminApi.suspendUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => adminApi.activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

export const useUpdateOrganizationSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orgId, settings }: { orgId: string; settings: any }) =>
      adminApi.updateOrganizationSettings(orgId, settings),
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.organizationMetrics(orgId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.customers() });
    },
  });
};

export const useExportData = () => {
  return useMutation({
    mutationFn: ({ type, format, filters }: { type: string; format: string; filters?: any }) =>
      adminApi.exportData(type, format, filters),
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: any) => adminApi.updateSystemSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.systemMetrics() });
    },
  });
};