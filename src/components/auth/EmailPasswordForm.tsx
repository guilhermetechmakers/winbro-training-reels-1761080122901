import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember_me: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface EmailPasswordFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  onForgotPassword?: () => void;
  className?: string;
}

const EmailPasswordForm: React.FC<EmailPasswordFormProps> = ({
  onSubmit,
  isLoading = false,
  onForgotPassword,
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  });

  const handleSubmit = (data: LoginFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01]"
            aria-describedby={form.formState.errors.email ? "email-error" : undefined}
            {...form.register('email')}
          />
        </div>
        {form.formState.errors.email && (
          <Alert variant="destructive" className="py-2" id="email-error" role="alert">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="text-xs">
              {form.formState.errors.email.message}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="pl-10 pr-10 h-12 transition-all duration-200 focus:scale-[1.01]"
            aria-describedby={form.formState.errors.password ? "password-error" : undefined}
            {...form.register('password')}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
          </Button>
        </div>
        {form.formState.errors.password && (
          <Alert variant="destructive" className="py-2" id="password-error" role="alert">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="text-xs">
              {form.formState.errors.password.message}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember-me"
            {...form.register('remember_me')}
            className="transition-all duration-200 hover:scale-110"
          />
          <Label htmlFor="remember-me" className="text-sm text-muted-foreground">
            Remember me
          </Label>
        </div>
        {onForgotPassword && (
          <Button
            type="button"
            variant="link"
            className="text-sm text-primary hover:text-primary/80 p-0 h-auto transition-all duration-200 hover:scale-105"
            onClick={onForgotPassword}
          >
            Forgot password?
          </Button>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
        aria-describedby={isLoading ? "loading-message" : undefined}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2" id="loading-message" aria-live="polite">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <span>Signing in...</span>
          </div>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
};

export default EmailPasswordForm;