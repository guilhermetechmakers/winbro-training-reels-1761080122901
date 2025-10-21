import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { toast } from 'sonner';
// import type { ReportResult } from '@/types';

// Query keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  metrics: (type: string, params: any) => [...analyticsKeys.all, 'metrics', type, params] as const,
  reports: () => [...analyticsKeys.all, 'reports'] as const,
  report: (id: string) => [...analyticsKeys.all, 'report', id] as const,
  heatmap: (clipId: string) => [...analyticsKeys.all, 'heatmap', clipId] as const,
  funnel: (courseId: string) => [...analyticsKeys.all, 'funnel', courseId] as const,
};

// Get dashboard metrics
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: analyticsApi.getDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get specific metrics
export const useMetrics = (type: string, params?: any) => {
  return useQuery({
    queryKey: analyticsKeys.metrics(type, params || {}),
    queryFn: () => analyticsApi.getMetrics(type, params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get reports
export const useReports = (params?: any) => {
  return useQuery({
    queryKey: analyticsKeys.reports(),
    queryFn: () => analyticsApi.getReports(params),
    staleTime: 1000 * 60 * 5,
  });
};

// Get specific report
export const useReport = (id: string) => {
  return useQuery({
    queryKey: analyticsKeys.report(id),
    queryFn: () => analyticsApi.getReport(id),
    enabled: !!id,
  });
};

// Get heatmap data
export const useHeatmap = (clipId: string) => {
  return useQuery({
    queryKey: analyticsKeys.heatmap(clipId),
    queryFn: () => analyticsApi.getHeatmap(clipId),
    enabled: !!clipId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get funnel data
export const useFunnel = (courseId: string) => {
  return useQuery({
    queryKey: analyticsKeys.funnel(courseId),
    queryFn: () => analyticsApi.getFunnel(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Create report mutation
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analyticsApi.createReport,
    onSuccess: () => {
      // Invalidate reports list
      queryClient.invalidateQueries({ queryKey: analyticsKeys.reports() });
      
      toast.success('Report created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create report: ${error.message}`);
    },
  });
};

// Download report mutation
export const useDownloadReport = () => {
  return useMutation({
    mutationFn: analyticsApi.downloadReport,
    onSuccess: (data: any) => {
      // Create download link
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to download report: ${error.message}`);
    },
  });
};

// Analytics event tracking hook
export const useAnalytics = () => {
  const trackEvent = (eventType: string, eventData: Record<string, any>) => {
    // This would typically send to your analytics service
    console.log('Analytics Event:', eventType, eventData);
    
    // Example: Send to your analytics API
    // analyticsApi.trackEvent(eventType, eventData);
  };

  const trackPageView = (page: string, title?: string) => {
    trackEvent('page_view', {
      page,
      title: title || document.title,
      url: window.location.href,
    });
  };

  const trackClipView = (clipId: string, duration: number, completionPercentage: number) => {
    trackEvent('clip.view', {
      clip_id: clipId,
      duration_watched: duration,
      completion_percentage: completionPercentage,
    });
  };

  const trackCourseStart = (courseId: string) => {
    trackEvent('course.start', {
      course_id: courseId,
    });
  };

  const trackCourseComplete = (courseId: string, score: number, timeSpent: number) => {
    trackEvent('course.complete', {
      course_id: courseId,
      score,
      time_spent: timeSpent,
    });
  };

  const trackSearch = (query: string, resultCount: number, clickedResultId?: string) => {
    trackEvent('search.query', {
      query,
      result_count: resultCount,
      clicked_result_id: clickedResultId,
    });
  };

  const trackQuizAttempt = (quizId: string, score: number, timeSpent: number) => {
    trackEvent('quiz.attempt', {
      quiz_id: quizId,
      score,
      time_spent: timeSpent,
    });
  };

  const trackUpload = (fileType: string, fileSize: number, success: boolean) => {
    trackEvent('upload.complete', {
      file_type: fileType,
      file_size: fileSize,
      success,
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackClipView,
    trackCourseStart,
    trackCourseComplete,
    trackSearch,
    trackQuizAttempt,
    trackUpload,
  };
};

// Real-time analytics hook
export const useRealtimeAnalytics = (interval: number = 30000) => {
  const { data: metrics, refetch } = useDashboardMetrics();

  // Set up polling for real-time updates
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, interval);

    return () => clearInterval(intervalId);
  }, [refetch, interval]);

  return {
    metrics,
    refetch,
  };
};

// Analytics filters hook
export const useAnalyticsFilters = () => {
  const [filters, setFilters] = React.useState({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    organization: '',
    content_type: 'all',
    metric_type: 'views',
  });

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      },
      organization: '',
      content_type: 'all',
      metric_type: 'views',
    });
  };

  return {
    filters,
    updateFilters,
    resetFilters,
  };
};