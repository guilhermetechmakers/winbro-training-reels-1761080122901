import type { SubscriptionPlan } from '@/types/billing';

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started with training',
    price: 2900, // $29.00
    currency: 'USD',
    interval: 'month',
    features: [
      {
        id: 'max_users_5',
        name: 'Up to 5 users',
        description: 'Add up to 5 team members',
        included: true,
        limit: 5
      },
      {
        id: 'max_clips_50',
        name: '50 training clips',
        description: 'Upload and manage up to 50 video clips',
        included: true,
        limit: 50
      },
      {
        id: 'max_courses_10',
        name: '10 courses',
        description: 'Create up to 10 structured courses',
        included: true,
        limit: 10
      },
      {
        id: 'storage_10gb',
        name: '10GB storage',
        description: 'Store up to 10GB of video content',
        included: true,
        limit: 10
      },
      {
        id: 'basic_analytics',
        name: 'Basic analytics',
        description: 'View basic usage and engagement metrics',
        included: true
      },
      {
        id: 'email_support',
        name: 'Email support',
        description: 'Get help via email support',
        included: true
      }
    ],
    limits: {
      max_users: 5,
      max_clips: 50,
      max_courses: 10,
      max_storage_gb: 10,
      max_api_calls: 1000,
      max_organizations: 1
    },
    is_popular: false,
    is_enterprise: false
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing teams with advanced training needs',
    price: 7900, // $79.00
    currency: 'USD',
    interval: 'month',
    features: [
      {
        id: 'max_users_25',
        name: 'Up to 25 users',
        description: 'Add up to 25 team members',
        included: true,
        limit: 25
      },
      {
        id: 'max_clips_200',
        name: '200 training clips',
        description: 'Upload and manage up to 200 video clips',
        included: true,
        limit: 200
      },
      {
        id: 'max_courses_50',
        name: '50 courses',
        description: 'Create up to 50 structured courses',
        included: true,
        limit: 50
      },
      {
        id: 'storage_50gb',
        name: '50GB storage',
        description: 'Store up to 50GB of video content',
        included: true,
        limit: 50
      },
      {
        id: 'advanced_analytics',
        name: 'Advanced analytics',
        description: 'Detailed insights and reporting',
        included: true
      },
      {
        id: 'priority_support',
        name: 'Priority support',
        description: 'Get faster response times',
        included: true
      },
      {
        id: 'custom_branding',
        name: 'Custom branding',
        description: 'Add your company logo and colors',
        included: true
      },
      {
        id: 'api_access',
        name: 'API access',
        description: 'Integrate with your existing tools',
        included: true
      }
    ],
    limits: {
      max_users: 25,
      max_clips: 200,
      max_courses: 50,
      max_storage_gb: 50,
      max_api_calls: 10000,
      max_organizations: 1
    },
    is_popular: true,
    is_enterprise: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with complex training requirements',
    price: 19900, // $199.00
    currency: 'USD',
    interval: 'month',
    features: [
      {
        id: 'unlimited_users',
        name: 'Unlimited users',
        description: 'Add unlimited team members',
        included: true
      },
      {
        id: 'unlimited_clips',
        name: 'Unlimited clips',
        description: 'Upload unlimited video clips',
        included: true
      },
      {
        id: 'unlimited_courses',
        name: 'Unlimited courses',
        description: 'Create unlimited courses',
        included: true
      },
      {
        id: 'unlimited_storage',
        name: 'Unlimited storage',
        description: 'Store unlimited video content',
        included: true
      },
      {
        id: 'enterprise_analytics',
        name: 'Enterprise analytics',
        description: 'Advanced reporting and insights',
        included: true
      },
      {
        id: 'dedicated_support',
        name: 'Dedicated support',
        description: '24/7 dedicated support team',
        included: true
      },
      {
        id: 'sso_integration',
        name: 'SSO integration',
        description: 'Single sign-on with your identity provider',
        included: true
      },
      {
        id: 'scim_provisioning',
        name: 'SCIM provisioning',
        description: 'Automated user management',
        included: true
      },
      {
        id: 'custom_integrations',
        name: 'Custom integrations',
        description: 'Build custom integrations',
        included: true
      },
      {
        id: 'audit_logs',
        name: 'Audit logs',
        description: 'Comprehensive activity tracking',
        included: true
      }
    ],
    limits: {
      max_users: -1, // unlimited
      max_clips: -1, // unlimited
      max_courses: -1, // unlimited
      max_storage_gb: -1, // unlimited
      max_api_calls: -1, // unlimited
      max_organizations: -1 // unlimited
    },
    is_popular: false,
    is_enterprise: true
  }
];

export const mockCoupons: any[] = [
  {
    id: 'welcome10',
    code: 'WELCOME10',
    name: 'Welcome Discount',
    description: '10% off your first month',
    type: 'percentage',
    value: 10,
    valid_from: '2024-01-01',
    valid_until: '2024-12-31',
    is_active: true,
    times_redeemed: 0,
    max_redemptions: 1000
  },
  {
    id: 'save50',
    code: 'SAVE50',
    name: 'Save $50',
    description: '$50 off your first payment',
    type: 'fixed_amount',
    value: 5000, // $50.00 in cents
    currency: 'USD',
    valid_from: '2024-01-01',
    valid_until: '2024-12-31',
    is_active: true,
    times_redeemed: 0,
    max_redemptions: 500
  }
];