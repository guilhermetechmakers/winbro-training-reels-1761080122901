export interface Subscription {
  id: string;
  organization_id: string;
  plan_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus = 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  currency: string;
  interval: 'month' | 'year';
  features: PlanFeature[];
  limits: PlanLimits;
  is_popular: boolean;
  is_enterprise: boolean;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  limit?: number;
}

export interface PlanLimits {
  max_users: number;
  max_clips: number;
  max_courses: number;
  max_storage_gb: number;
  max_api_calls: number;
  max_organizations: number;
}

export interface Invoice {
  id: string;
  organization_id: string;
  subscription_id: string;
  number: string;
  status: InvoiceStatus;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  currency: string;
  due_date: string;
  paid_at?: string;
  created_at: string;
  line_items: InvoiceLineItem[];
  payment_method?: PaymentMethod;
  pdf_url?: string;
}

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_amount: number;
  total_amount: number;
  period_start: string;
  period_end: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  last4?: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
  is_default: boolean;
}

export interface Transaction {
  id: string;
  organization_id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  reference_id?: string;
  created_at: string;
  metadata: Record<string, any>;
}

export type TransactionType = 'payment' | 'refund' | 'credit' | 'chargeback' | 'adjustment';
export type TransactionStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  currency?: string;
  max_redemptions?: number;
  times_redeemed: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
}

export interface UsageMetrics {
  organization_id: string;
  period_start: string;
  period_end: string;
  users: number;
  clips: number;
  courses: number;
  storage_gb: number;
  api_calls: number;
  overage_fees: number;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface TaxInfo {
  tax_id: string;
  company_name: string;
  address: BillingAddress;
  vat_number?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  client_secret: string;
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  created_at: string;
  processed: boolean;
  processed_at?: string;
  error_message?: string;
}

export interface BillingSettings {
  organization_id: string;
  billing_email: string;
  billing_address: BillingAddress;
  tax_info?: TaxInfo;
  payment_methods: PaymentMethod[];
  default_payment_method_id?: string;
  invoice_settings: InvoiceSettings;
  created_at: string;
  updated_at: string;
}

export interface InvoiceSettings {
  custom_fields: Record<string, string>;
  footer: string;
  default_payment_method?: string;
  days_until_due: number;
}

export interface Proration {
  amount: number;
  currency: string;
  description: string;
  period_start: string;
  period_end: string;
}

export interface UpgradeRequest {
  plan_id: string;
  proration: Proration;
  effective_date: string;
}

export interface DowngradeRequest {
  plan_id: string;
  effective_date: string;
  reason: string;
}