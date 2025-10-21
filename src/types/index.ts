// Re-export all types for easy importing
export * from './auth';
export * from './content';
export * from './analytics';
export * from './billing';
export * from './api';

// Common utility types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface TimestampedEntity extends BaseEntity {
  created_at: string;
  updated_at: string;
}

export interface SoftDeleteEntity extends TimestampedEntity {
  deleted_at?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  disabled?: (row: any) => boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  description?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  persistent?: boolean;
  created_at: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface ToastProps {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  persistent?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
  data?: any;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface SearchState {
  query: string;
  filters: Record<string, any>;
  results: any[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  hasMore: boolean;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: string;
  fontSize: 'sm' | 'md' | 'lg';
}

export interface LayoutConfig {
  sidebar: {
    collapsed: boolean;
    width: number;
    position: 'left' | 'right';
  };
  header: {
    height: number;
    sticky: boolean;
  };
  footer: {
    visible: boolean;
    height: number;
  };
  content: {
    padding: number;
    maxWidth: string;
  };
}

import type { User, Organization } from './auth';

export interface UserSession {
  user: User;
  token: string;
  expires_at: string;
  refresh_token: string;
  permissions: string[];
  organization: Organization;
}

export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  api_url: string;
  cdn_url: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
  maintenance: {
    enabled: boolean;
    message?: string;
    start_time?: string;
    end_time?: string;
  };
}