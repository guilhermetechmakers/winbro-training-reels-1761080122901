import type { BaseEntity } from './index';

// Help Section Types
export interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

// FAQ Types
export interface FAQItem extends BaseEntity {
  question: string;
  answer: string;
  category: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'archived' | 'draft';
  views: number;
  helpful: number;
  not_helpful: number;
}

export interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  count: number;
}

// Onboarding Guide Types
export interface OnboardingStep extends BaseEntity {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tips: string[];
  order: number;
  estimated_time: number; // in minutes
  required: boolean;
  video_url?: string;
  resources: OnboardingResource[];
}

export interface OnboardingResource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'template' | 'checklist';
  url: string;
  description: string;
  size?: string;
  duration?: number; // in minutes
}

// Contact Support Types
export interface SupportTicket extends BaseEntity {
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general';
  user_id: string;
  assigned_to?: string;
  attachments: SupportAttachment[];
  messages: SupportMessage[];
  resolution?: string;
  resolved_at?: string;
}

export interface SupportAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
}

export interface SupportMessage extends BaseEntity {
  ticket_id: string;
  sender_id: string;
  sender_type: 'user' | 'support';
  message: string;
  attachments: SupportAttachment[];
  is_internal: boolean;
}

// Documentation Types
export interface DocumentationArticle extends BaseEntity {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  last_modified_by: string;
  views: number;
  helpful: number;
  not_helpful: number;
  featured: boolean;
  order: number;
  parent_id?: string;
  children: DocumentationArticle[];
}

export interface DocumentationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  parent_id?: string;
  order: number;
  article_count: number;
  children: DocumentationCategory[];
}

// Search Types
export interface HelpSearchResult {
  id: string;
  type: 'faq' | 'article' | 'step' | 'ticket';
  title: string;
  content: string;
  category: string;
  tags: string[];
  relevance_score: number;
  url: string;
}

export interface HelpSearchFilters {
  type?: ('faq' | 'article' | 'step' | 'ticket')[];
  category?: string[];
  tags?: string[];
  date_range?: {
    start: string;
    end: string;
  };
}

// Company Information Types
export interface CompanyInfo {
  name: string;
  description: string;
  mission: string;
  vision: string;
  values: string[];
  founded_year: number;
  headquarters: string;
  website: string;
  social_links: SocialLink[];
  team: TeamMember[];
  stats: CompanyStats;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url?: string;
  social_links: SocialLink[];
  expertise: string[];
}

export interface CompanyStats {
  customers: number;
  clips_processed: number;
  hours_saved: number;
  satisfaction_score: number;
  uptime_percentage: number;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: File[];
}

export interface ContactFormState {
  data: ContactFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// API Response Types
export interface HelpPageData {
  faq_items: FAQItem[];
  faq_categories: FAQCategory[];
  onboarding_steps: OnboardingStep[];
  documentation_articles: DocumentationArticle[];
  documentation_categories: DocumentationCategory[];
  company_info: CompanyInfo;
  recent_tickets: SupportTicket[];
  popular_articles: DocumentationArticle[];
  featured_content: {
    faq: FAQItem[];
    articles: DocumentationArticle[];
    steps: OnboardingStep[];
  };
}

// Hook Types
export interface UseHelpSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: HelpSearchResult[];
  loading: boolean;
  error: string | null;
  search: (query: string, filters?: HelpSearchFilters) => Promise<void>;
  clear: () => void;
}

export interface UseContactFormReturn {
  formState: ContactFormState;
  updateField: (field: keyof ContactFormData, value: any) => void;
  submit: () => Promise<void>;
  reset: () => void;
  validate: () => boolean;
}

// Component Props Types
export interface HelpPageProps {
  initialData?: HelpPageData;
  searchQuery?: string;
  activeTab?: string;
}

export interface FAQSectionProps {
  faqItems: FAQItem[];
  categories: FAQCategory[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface OnboardingGuideProps {
  steps: OnboardingStep[];
  onStepComplete: (stepId: string) => void;
  completedSteps: string[];
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  loading?: boolean;
}

export interface DocumentationSectionProps {
  articles: DocumentationArticle[];
  categories: DocumentationCategory[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface CompanyAboutProps {
  companyInfo: CompanyInfo;
}