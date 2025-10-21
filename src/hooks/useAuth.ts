import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, usersApi } from '@/lib/api';
import { authToasts } from '@/components/auth/ErrorSuccessToasters';
import type { 
  SignInInput, 
  SignUpInput, 
  AuthResponse, 
  PasswordResetRequest, 
  PasswordResetConfirm,
  EmailVerificationRequest,
  EmailVerificationConfirm,
  User 
} from '@/types/auth';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

// Get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => usersApi.getCurrent(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};

// Sign in mutation
export const useSignIn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SignInInput) => authApi.signIn(data),
    onSuccess: (response: AuthResponse) => {
      // Store tokens
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Update cache
      queryClient.setQueryData(authKeys.user(), response.user);
      
      // Show success toast
      authToasts.loginSuccess();
    },
    onError: (error: any) => {
      console.error('Sign in error:', error);
      authToasts.loginError(error.message);
    },
  });
};

// Sign up mutation
export const useSignUp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SignUpInput) => authApi.signUp(data),
    onSuccess: (response: AuthResponse) => {
      // Store tokens
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Update cache
      queryClient.setQueryData(authKeys.user(), response.user);
      
      // Show success toast
      authToasts.signupSuccess();
    },
    onError: (error: any) => {
      console.error('Sign up error:', error);
      authToasts.signupError(error.message);
    },
  });
};

// Sign out mutation
export const useSignOut = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authApi.signOut(),
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      
      // Clear cache
      queryClient.clear();
      
      // Show success toast
      authToasts.loginSuccess();
    },
    onError: (error: any) => {
      console.error('Sign out error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      queryClient.clear();
    },
  });
};

// Password reset request mutation
export const usePasswordResetRequest = () => {
  return useMutation({
    mutationFn: (data: PasswordResetRequest) => authApi.requestPasswordReset(data.email),
    onSuccess: () => {
      authToasts.passwordResetSent();
    },
    onError: (error: any) => {
      console.error('Password reset request error:', error);
      authToasts.passwordResetError(error.message);
    },
  });
};

// Password reset confirm mutation
export const usePasswordResetConfirm = () => {
  return useMutation({
    mutationFn: (data: PasswordResetConfirm) => 
      authApi.resetPassword(data.token, data.new_password),
    onSuccess: () => {
      authToasts.loginSuccess();
    },
    onError: (error: any) => {
      console.error('Password reset confirm error:', error);
      authToasts.passwordResetError(error.message);
    },
  });
};

// Email verification request mutation
export const useEmailVerificationRequest = () => {
  return useMutation({
    mutationFn: (data: EmailVerificationRequest) => authApi.resendVerification(data.email),
    onSuccess: () => {
      authToasts.emailVerificationSent();
    },
    onError: (error: any) => {
      console.error('Email verification request error:', error);
      authToasts.emailVerificationError(error.message);
    },
  });
};

// Email verification confirm mutation
export const useEmailVerificationConfirm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: EmailVerificationConfirm) => {
      const response = await authApi.verifyEmail(data.token) as { user: User };
      return { user: response.user };
    },
    onSuccess: (response: { user: User }) => {
      // Update user in cache
      queryClient.setQueryData(authKeys.user(), response.user);
      authToasts.loginSuccess();
    },
    onError: (error: any) => {
      console.error('Email verification confirm error:', error);
      authToasts.emailVerificationError(error.message);
    },
  });
};

// Token refresh mutation
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    onSuccess: (response: { token: string }) => {
      localStorage.setItem('auth_token', response.token);
    },
    onError: () => {
      // If refresh fails, clear everything and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      queryClient.clear();
      window.location.href = '/login';
    },
  });
};

// Auth status hook
export const useAuthStatus = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
  };
};

// Auth actions hook
export const useAuthActions = () => {
  const signIn = useSignIn();
  const signUp = useSignUp();
  const signOut = useSignOut();
  const passwordResetRequest = usePasswordResetRequest();
  const passwordResetConfirm = usePasswordResetConfirm();
  const emailVerificationRequest = useEmailVerificationRequest();
  const emailVerificationConfirm = useEmailVerificationConfirm();
  const refreshToken = useRefreshToken();
  
  return {
    signIn: signIn.mutate,
    signUp: signUp.mutate,
    signOut: signOut.mutate,
    passwordResetRequest: passwordResetRequest.mutate,
    passwordResetConfirm: passwordResetConfirm.mutate,
    emailVerificationRequest: emailVerificationRequest.mutate,
    emailVerificationConfirm: emailVerificationConfirm.mutate,
    refreshToken: refreshToken.mutate,
    
    // Loading states
    isSigningIn: signIn.isPending,
    isSigningUp: signUp.isPending,
    isSigningOut: signOut.isPending,
    isRequestingPasswordReset: passwordResetRequest.isPending,
    isConfirmingPasswordReset: passwordResetConfirm.isPending,
    isRequestingEmailVerification: emailVerificationRequest.isPending,
    isConfirmingEmailVerification: emailVerificationConfirm.isPending,
    isRefreshingToken: refreshToken.isPending,
  };
};