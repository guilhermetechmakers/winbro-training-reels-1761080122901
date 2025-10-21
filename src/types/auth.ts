export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  organization_id?: string;
  is_verified: boolean;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  preferences?: UserPreferences;
}

export type UserRole = 'admin' | 'trainer' | 'learner' | 'customer_admin' | 'reviewer';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    in_app: boolean;
    course_updates: boolean;
    new_content: boolean;
  };
  language: string;
  timezone: string;
}

export interface SignInInput {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignUpInput {
  email: string;
  password: string;
  full_name: string;
  organization_name?: string;
  terms_accepted: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
  expires_in: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationConfirm {
  token: string;
}

export interface TwoFactorSetup {
  secret: string;
  qr_code: string;
  backup_codes: string[];
}

export interface TwoFactorVerify {
  code: string;
}

export interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oauth' | 'oidc';
  enabled: boolean;
  config: Record<string, any>;
}

export interface Organization {
  id: string;
  name: string;
  domain?: string;
  sso_providers: SSOProvider[];
  settings: OrganizationSettings;
  created_at: string;
  updated_at: string;
}

export interface OrganizationSettings {
  branding: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
  };
  library_allocation: {
    machine_models: string[];
    seat_count: number;
    quota_per_user: number;
  };
  certificate_template: {
    template_id: string;
    custom_fields: Record<string, any>;
  };
  data_retention: {
    clip_retention_days: number;
    user_data_retention_days: number;
  };
}