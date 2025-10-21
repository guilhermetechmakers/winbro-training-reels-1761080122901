import React from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface ToastConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ErrorSuccessToastersProps {
  // This component provides utility functions for showing toasts
  // The actual toast display is handled by the Sonner toaster in App.tsx
}

// Utility functions for showing different types of toasts
export const showToast = (config: ToastConfig) => {
  const { type, title, description, duration = 4000 } = config;

  const toastConfig = {
    duration,
    description,
  };

  switch (type) {
    case 'success':
      toast.success(title, toastConfig);
      break;
    case 'error':
      toast.error(title, toastConfig);
      break;
    case 'warning':
      toast.warning(title, toastConfig);
      break;
    case 'info':
      toast.info(title, toastConfig);
      break;
    default:
      toast(title, toastConfig);
  }
};

// Predefined toast messages for common auth scenarios
export const authToasts = {
  loginSuccess: () => showToast({
    type: 'success',
    title: 'Welcome back!',
    description: 'You have been successfully signed in.',
  }),
  
  loginError: (message?: string) => showToast({
    type: 'error',
    title: 'Sign in failed',
    description: message || 'Invalid email or password. Please try again.',
  }),
  
  signupSuccess: () => showToast({
    type: 'success',
    title: 'Account created!',
    description: 'Please check your email to verify your account.',
  }),
  
  signupError: (message?: string) => showToast({
    type: 'error',
    title: 'Sign up failed',
    description: message || 'Failed to create account. Please try again.',
  }),
  
  passwordResetSent: () => showToast({
    type: 'info',
    title: 'Reset link sent',
    description: 'Check your email for password reset instructions.',
  }),
  
  passwordResetError: (message?: string) => showToast({
    type: 'error',
    title: 'Reset failed',
    description: message || 'Failed to send reset email. Please try again.',
  }),
  
  emailVerificationSent: () => showToast({
    type: 'info',
    title: 'Verification sent',
    description: 'Check your email for verification instructions.',
  }),
  
  emailVerificationError: (message?: string) => showToast({
    type: 'error',
    title: 'Verification failed',
    description: message || 'Failed to send verification email. Please try again.',
  }),
  
  ssoNotAvailable: (provider: string) => showToast({
    type: 'warning',
    title: 'SSO not available',
    description: `${provider} login is not yet available. Please use email and password.`,
  }),
  
  sessionExpired: () => showToast({
    type: 'warning',
    title: 'Session expired',
    description: 'Please sign in again to continue.',
  }),
  
  networkError: () => showToast({
    type: 'error',
    title: 'Connection error',
    description: 'Please check your internet connection and try again.',
  }),
};

// Component for displaying inline error messages
interface InlineErrorProps {
  message: string;
  className?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({ 
  message, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center space-x-2 text-error text-sm ${className}`}>
      <XCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

// Component for displaying inline success messages
interface InlineSuccessProps {
  message: string;
  className?: string;
}

export const InlineSuccess: React.FC<InlineSuccessProps> = ({ 
  message, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center space-x-2 text-success text-sm ${className}`}>
      <CheckCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

// Component for displaying inline warning messages
interface InlineWarningProps {
  message: string;
  className?: string;
}

export const InlineWarning: React.FC<InlineWarningProps> = ({ 
  message, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center space-x-2 text-secondary text-sm ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

// Component for displaying inline info messages
interface InlineInfoProps {
  message: string;
  className?: string;
}

export const InlineInfo: React.FC<InlineInfoProps> = ({ 
  message, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center space-x-2 text-info text-sm ${className}`}>
      <Info className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

// Main component (mostly for utility functions)
const ErrorSuccessToasters: React.FC<ErrorSuccessToastersProps> = () => {
  // This component doesn't render anything
  // It's just a container for utility functions
  return null;
};

export default ErrorSuccessToasters;