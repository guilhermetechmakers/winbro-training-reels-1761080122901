import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Auth Components
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';

// Icons
import { 
  Lock, 
  Eye, 
  EyeOff,
  ArrowLeft, 
  ArrowRight,
  AlertCircle,
  Shield
} from 'lucide-react';

// Hooks
import { useAuthActions } from '@/hooks/useAuth';

// Validation schema
const confirmSchema = z.object({
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirm_password: z.string(),
}).refine(data => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type ConfirmFormData = z.infer<typeof confirmSchema>;

interface PasswordResetConfirmFormProps {
  token: string;
  onSuccess: () => void;
  onBack: () => void;
}

const PasswordResetConfirmForm: React.FC<PasswordResetConfirmFormProps> = ({
  token,
  onSuccess,
  onBack
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { passwordResetConfirm, isConfirmingPasswordReset } = useAuthActions();

  const form = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  });

  const onSubmit = (data: ConfirmFormData) => {
    passwordResetConfirm({
      token,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    }, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm animate-fade-in-up">
      <CardHeader className="space-y-2 text-center pb-8">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        
        <CardTitle className="text-2xl font-bold text-foreground">
          Create New Password
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your new password below
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Password reset confirmation form">
          <div className="space-y-2">
            <Label htmlFor="new_password" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
              <Input
                id="new_password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                className="pl-10 pr-10 h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
                {...form.register('new_password')}
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
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <PasswordStrengthMeter password={form.watch('new_password') || ''} />
            {form.formState.errors.new_password && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {form.formState.errors.new_password.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
              <Input
                id="confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                className="pl-10 pr-10 h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
                {...form.register('confirm_password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {form.formState.errors.confirm_password && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {form.formState.errors.confirm_password.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            disabled={isConfirmingPasswordReset}
          >
            {isConfirmingPasswordReset ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating password...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Changed your mind?</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </div>

        {/* Help text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <Button
              variant="link"
              className="text-primary hover:text-primary/80 p-0 h-auto text-sm transition-all duration-200 hover:scale-105"
              onClick={() => window.open('/help', '_blank')}
            >
              Contact Support
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordResetConfirmForm;
