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

// Icons
import { 
  Mail, 
  ArrowLeft, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react';

// Hooks
import { useAuthActions } from '@/hooks/useAuth';

// Validation schema
const requestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type RequestFormData = z.infer<typeof requestSchema>;

interface PasswordResetRequestFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const PasswordResetRequestForm: React.FC<PasswordResetRequestFormProps> = ({
  onSuccess,
  onBack
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { passwordResetRequest, isRequestingPasswordReset } = useAuthActions();

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: RequestFormData) => {
    passwordResetRequest(data, {
      onSuccess: () => {
        setIsSubmitted(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      },
    });
  };

  if (isSubmitted) {
    return (
      <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm animate-fade-in-up">
        <CardHeader className="space-y-2 text-center pb-8">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-foreground">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We've sent password reset instructions to your email address
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-success/20 bg-success/5">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              If an account with that email exists, you'll receive reset instructions shortly.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Didn't receive the email? Check your spam folder or</p>
              <Button
                variant="link"
                className="text-primary hover:text-primary/80 p-0 h-auto text-sm transition-all duration-200 hover:scale-105"
                onClick={() => setIsSubmitted(false)}
              >
                try again
              </Button>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm animate-fade-in-up">
      <CardHeader className="space-y-2 text-center pb-8">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        
        <CardTitle className="text-2xl font-bold text-foreground">
          Reset Your Password
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Password reset request form">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
                {...form.register('email')}
              />
            </div>
            {form.formState.errors.email && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {form.formState.errors.email.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            disabled={isRequestingPasswordReset}
          >
            {isRequestingPasswordReset ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending reset link...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Send Reset Link</span>
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
              <span className="bg-card px-2 text-muted-foreground">Remember your password?</span>
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

export default PasswordResetRequestForm;
