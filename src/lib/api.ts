// Simple fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// API utilities
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) => 
    apiRequest(endpoint, { method: 'DELETE' }),
};

// Auth API
export const authApi = {
  signIn: (credentials: { email: string; password: string; remember_me?: boolean }) =>
    api.post<{ user: any; token: string; refresh_token: string; expires_in: number }>('/auth/login', credentials),
  
  signUp: (data: { email: string; password: string; full_name: string; terms_accepted: boolean }) =>
    api.post<{ user: any; token: string; refresh_token: string; expires_in: number }>('/auth/register', data),
  
  signOut: () => api.post('/auth/logout', {}),
  
  refreshToken: () => api.post<{ token: string }>('/auth/refresh', {}),
  
  requestPasswordReset: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, password: newPassword }),
  
  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),
  
  resendVerification: (email: string) =>
    api.post('/auth/resend-verification', { email }),
};

// Users API
export const usersApi = {
  getCurrent: () => api.get<any>('/users/me'),
  
  updateProfile: (updates: any) =>
    api.put<any>('/users/me', updates),
  
  getById: (id: string) => api.get<any>(`/users/${id}`),
  
  getAll: (_params?: any) => api.get<any>('/users'),
  
  delete: (id: string) => api.delete(`/users/${id}`),
  
  invite: (emails: string[], role: string) =>
    api.post('/users/invite', { emails, role }),
  
  bulkInvite: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/users/bulk-invite', formData);
  },
};

// Clips API
export const clipsApi = {
  getAll: (_params?: any) => api.get<any>('/clips'),
  
  getById: (id: string) => api.get<any>(`/clips/${id}`),
  
  create: (data: any) => api.post<any>('/clips', data),
  
  update: (id: string, updates: any) =>
    api.put<any>(`/clips/${id}`, updates),
  
  delete: (id: string) => api.delete(`/clips/${id}`),
  
  upload: (file: File, onProgress?: (progress: number) => void): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });
      
      xhr.open('POST', `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/clips/upload`);
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  },
  
  search: (_query: string, _filters?: any) =>
    api.get<any>('/clips/search'),
  
  bookmark: (id: string) => api.post(`/clips/${id}/bookmark`, {}),
  
  unbookmark: (id: string) => api.delete(`/clips/${id}/bookmark`),
  
  addNote: (id: string, content: string, timestamp?: number) =>
    api.post(`/clips/${id}/notes`, { content, timestamp }),
  
  getNotes: (id: string) => api.get<any>(`/clips/${id}/notes`),
  
  addComment: (id: string, content: string, parent_id?: string) =>
    api.post(`/clips/${id}/comments`, { content, parent_id }),
  
  getComments: (id: string) => api.get<any>(`/clips/${id}/comments`),
  
  report: (id: string, reason: string, description?: string) =>
    api.post(`/clips/${id}/report`, { reason, description }),
};

// Courses API
export const coursesApi = {
  getAll: (_params?: any) => api.get<any>('/courses'),
  
  getById: (id: string) => api.get<any>(`/courses/${id}`),
  
  create: (data: any) => api.post<any>('/courses', data),
  
  update: (id: string, updates: any) =>
    api.put<any>(`/courses/${id}`, updates),
  
  delete: (id: string) => api.delete(`/courses/${id}`),
  
  enroll: (id: string) => api.post(`/courses/${id}/enroll`, {}),
  
  unenroll: (id: string) => api.delete(`/courses/${id}/enroll`),
  
  getProgress: (id: string) => api.get<any>(`/courses/${id}/progress`),
  
  updateProgress: (id: string, progress: any) =>
    api.put<any>(`/courses/${id}/progress`, progress),
  
  getCertificate: (id: string) => api.get<any>(`/courses/${id}/certificate`),
};

// Quizzes API
export const quizzesApi = {
  getById: (id: string) => api.get<any>(`/quizzes/${id}`),
  
  create: (data: any) => api.post<any>('/quizzes', data),
  
  update: (id: string, updates: any) =>
    api.put<any>(`/quizzes/${id}`, updates),
  
  delete: (id: string) => api.delete(`/quizzes/${id}`),
  
  submit: (id: string, answers: any) =>
    api.post<any>(`/quizzes/${id}/submit`, { answers }),
  
  getAttempts: (id: string) => api.get<any>(`/quizzes/${id}/attempts`),
  
  getAttempt: (id: string, attemptId: string) =>
    api.get<any>(`/quizzes/${id}/attempts/${attemptId}`),
  
  getResult: (id: string, attemptId: string) =>
    api.get<any>(`/quizzes/${id}/results/${attemptId}`),
  
  retake: (id: string) => api.post<any>(`/quizzes/${id}/retake`, {}),
  
  getRetakeOptions: (id: string) => api.get<any>(`/quizzes/${id}/retake-options`),
};

// Certificates API
export const certificatesApi = {
  getById: (id: string) => api.get<any>(`/certificates/${id}`),
  
  getByCourse: (courseId: string) => api.get<any>(`/certificates/course/${courseId}`),
  
  getByUser: (_params?: any) => api.get<any>('/certificates/user'),
  
  download: (id: string) => api.get<any>(`/certificates/${id}/download`),
  
  share: (id: string) => api.post<any>(`/certificates/${id}/share`, {}),
  
  verify: (certificateNumber: string) => api.get<any>(`/certificates/verify/${certificateNumber}`),
  
  generate: (courseId: string, userId: string) => 
    api.post<any>('/certificates/generate', { course_id: courseId, user_id: userId }),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => api.get<any>('/analytics/dashboard'),
  
  getMetrics: (type: string, _params?: any) =>
    api.get<any>(`/analytics/${type}`),
  
  getReports: (_params?: any) => api.get<any>('/analytics/reports'),
  
  createReport: (config: any) => api.post<any>('/analytics/reports', config),
  
  getReport: (id: string) => api.get<any>(`/analytics/reports/${id}`),
  
  downloadReport: (id: string) => api.get<any>(`/analytics/reports/${id}/download`),
  
  getHeatmap: (clipId: string) => api.get<any>(`/analytics/heatmap/${clipId}`),
  
  getFunnel: (courseId: string) => api.get<any>(`/analytics/funnel/${courseId}`),
};

// Billing API
export const billingApi = {
  getSubscription: () => api.get<any>('/billing/subscription'),
  
  getInvoices: (_params?: any) => api.get<any>('/billing/invoices'),
  
  getInvoice: (id: string) => api.get<any>(`/billing/invoices/${id}`),
  
  getPaymentMethods: () => api.get<any>('/billing/payment-methods'),
  
  addPaymentMethod: (data: any) => api.post<any>('/billing/payment-methods', data),
  
  updatePaymentMethod: (id: string, data: any) =>
    api.put<any>(`/billing/payment-methods/${id}`, data),
  
  deletePaymentMethod: (id: string) => api.delete(`/billing/payment-methods/${id}`),
  
  updateSubscription: (planId: string) =>
    api.put<any>('/billing/subscription', { plan_id: planId }),
  
  cancelSubscription: () => api.post<any>('/billing/subscription/cancel', {}),
  
  getUsage: () => api.get<any>('/billing/usage'),
  
  getCoupons: () => api.get<any>('/billing/coupons'),
  
  applyCoupon: (code: string) => api.post<any>('/billing/coupons/apply', { code }),
};

// Organizations API
export const organizationsApi = {
  getCurrent: () => api.get<any>('/organizations/me'),
  
  update: (updates: any) => api.put<any>('/organizations/me', updates),
  
  getSettings: () => api.get<any>('/organizations/settings'),
  
  updateSettings: (settings: any) =>
    api.put<any>('/organizations/settings', settings),
  
  getUsers: (_params?: any) => api.get<any>('/organizations/users'),
  
  inviteUser: (email: string, role: string) =>
    api.post<any>('/organizations/users/invite', { email, role }),
  
  updateUserRole: (userId: string, role: string) =>
    api.put<any>(`/organizations/users/${userId}/role`, { role }),
  
  removeUser: (userId: string) => api.delete(`/organizations/users/${userId}`),
};

// Search API
export const searchApi = {
  search: (_query: string, _filters?: any) =>
    api.get<any>('/search'),
  
  getSuggestions: (_query: string) =>
    api.get<any>('/search/suggestions'),
  
  getFacets: (_filters?: any) =>
    api.get<any>('/search/facets'),
};

// Upload API
export const uploadApi = {
  getPresignedUrl: (filename: string, contentType: string) =>
    api.post<{ url: string; fields: any }>('/upload/presigned-url', {
      filename,
      contentType,
    }),
  
  uploadToS3: (url: string, fields: any, file: File) => {
    const formData = new FormData();
    Object.keys(fields).forEach(key => {
      formData.append(key, fields[key]);
    });
    formData.append('file', file);
    
    return fetch(url, {
      method: 'POST',
      body: formData,
    });
  },
  
  getUploadStatus: (id: string) => api.get<any>(`/upload/status/${id}`),
  
  cancelUpload: (id: string) => api.post(`/upload/cancel/${id}`, {}),
};

// Export API
export const exportApi = {
  createExport: (type: string, format: string, filters?: any) =>
    api.post<any>('/export', { type, format, filters }),
  
  getExport: (id: string) => api.get<any>(`/export/${id}`),
  
  downloadExport: (id: string) => api.get<any>(`/export/${id}/download`),
  
  getExports: (_params?: any) => api.get<any>('/export'),
};

// Admin API
export const adminApi = {
  getDashboard: () => api.get<any>('/admin/dashboard'),
  
  getKPIs: () => api.get<any>('/admin/kpis'),
  
  getCharts: (type: string, _params?: any) =>
    api.get<any>(`/admin/charts/${type}`),
  
  getOutstandingTasks: (_params?: any) => api.get<any>('/admin/tasks'),
  
  getCustomers: (_params?: any) => api.get<any>('/admin/customers'),
  
  getSystemHealth: () => api.get<any>('/admin/health'),
  
  getNotifications: (_params?: any) => api.get<any>('/admin/notifications'),
  
  markNotificationRead: (id: string) => api.put(`/admin/notifications/${id}/read`, {}),
  
  getModerationQueue: (_params?: any) => api.get<any>('/admin/moderation'),
  
  moderateContent: (id: string, action: string, notes?: string) =>
    api.post(`/admin/moderation/${id}`, { action, notes }),
  
  getUsers: (_params?: any) => api.get<any>('/admin/users'),
  
  updateUserRole: (userId: string, role: string) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  
  suspendUser: (userId: string, reason: string) =>
    api.post(`/admin/users/${userId}/suspend`, { reason }),
  
  activateUser: (userId: string) => api.post(`/admin/users/${userId}/activate`, {}),
  
  getOrganizationMetrics: (orgId: string) =>
    api.get<any>(`/admin/organizations/${orgId}/metrics`),
  
  updateOrganizationSettings: (orgId: string, settings: any) =>
    api.put(`/admin/organizations/${orgId}/settings`, settings),
  
  getContentPerformance: (contentId: string) =>
    api.get<any>(`/admin/content/${contentId}/performance`),
  
  getSearchAnalytics: (_params?: any) => api.get<any>('/admin/search-analytics'),
  
  getUploadAnalytics: (_params?: any) => api.get<any>('/admin/upload-analytics'),
  
  getCertificateAnalytics: (_params?: any) => api.get<any>('/admin/certificate-analytics'),
  
  exportData: (type: string, format: string, filters?: any) =>
    api.post<any>('/admin/export', { type, format, filters }),
  
  getAuditLogs: (_params?: any) => api.get<any>('/admin/audit-logs'),
  
  getSystemMetrics: () => api.get<any>('/admin/system-metrics'),
  
  updateSystemSettings: (settings: any) =>
    api.put('/admin/system-settings', settings),
};