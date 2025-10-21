import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Auth Components
import ToggleTabs from '@/components/auth/ToggleTabs';
import EmailPasswordForm from '@/components/auth/EmailPasswordForm';
import SSOButtons from '@/components/auth/SSOButtons';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import TermsCheckbox from '@/components/auth/TermsCheckbox';
// import ForgotPasswordLink from '@/components/auth/ForgotPasswordLink';
import { authToasts } from '@/components/auth/ErrorSuccessToasters';

// Icons
import { 
  Eye, 
  EyeOff, 
  AlertCircle,
  Mail,
  Lock,
  User,
  Building,
  Shield
} from 'lucide-react';

// Hooks
import { useAuthActions } from '@/hooks/useAuth';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember_me: z.boolean().optional(),
});

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirm_password: z.string(),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  organization_name: z.string().optional(),
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

// Main Login/Signup Page Component
const LoginSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auth actions
  const { 
    signIn, 
    signUp, 
    isSigningIn, 
    isSigningUp 
  } = useAuthActions();

  // Login form (handled by EmailPasswordForm component)
  // const loginForm = useForm<LoginFormData>({
  //   resolver: zodResolver(loginSchema),
  //   defaultValues: {
  //     email: '',
  //     password: '',
  //     remember_me: false,
  //   },
  // });

  // Signup form
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      full_name: '',
      organization_name: '',
      terms_accepted: false,
    },
  });

  // Login handler
  const onLogin = (data: LoginFormData) => {
    signIn(data, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  // Signup handler
  const onSignup = (data: SignupFormData) => {
    signUp({
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      terms_accepted: data.terms_accepted,
    }, {
      onSuccess: () => {
        navigate('/email-verification');
      },
    });
  };

  // SSO handlers
  const handleSSOLogin = (provider: 'saml' | 'google') => {
    authToasts.ssoNotAvailable(provider === 'saml' ? 'Enterprise SSO' : 'Google Workspace');
  };

  // Loading state
  const isLoading = isSigningIn || isSigningUp;

  // Forgot password handler
  const handleForgotPassword = () => {
    navigate('/password-reset');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-scale-in" aria-hidden="true">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome to Winbro Training
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Access your microlearning platform
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <ToggleTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
            />

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} aria-label="Authentication form">
              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-6" role="tabpanel" aria-labelledby="login-tab">
                <EmailPasswordForm
                  onSubmit={onLogin}
                  isLoading={isLoading}
                  onForgotPassword={handleForgotPassword}
                />
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4 mt-6" role="tabpanel" aria-labelledby="signup-tab">
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4" aria-label="Create account form">
                  <div className="space-y-2">
                    <Label htmlFor="signup-full-name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-full-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01]"
                        {...signupForm.register('full_name')}
                      />
                    </div>
                    {signupForm.formState.errors.full_name && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {signupForm.formState.errors.full_name.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01]"
                        {...signupForm.register('email')}
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {signupForm.formState.errors.email.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-organization" className="text-sm font-medium">
                      Organization Name (Optional)
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-organization"
                        type="text"
                        placeholder="Enter your organization"
                        className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01]"
                        {...signupForm.register('organization_name')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        className="pl-10 pr-10 h-12 transition-all duration-200 focus:scale-[1.01]"
                        {...signupForm.register('password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <PasswordStrengthMeter password={signupForm.watch('password') || ''} />
                    {signupForm.formState.errors.password && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {signupForm.formState.errors.password.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 h-12 transition-all duration-200 focus:scale-[1.01]"
                        {...signupForm.register('confirm_password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {signupForm.formState.errors.confirm_password && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {signupForm.formState.errors.confirm_password.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <TermsCheckbox
                    checked={signupForm.watch('terms_accepted') || false}
                    onChange={(checked) => signupForm.setValue('terms_accepted', checked)}
                    error={signupForm.formState.errors.terms_accepted?.message}
                    onTermsClick={() => navigate('/terms')}
                    onPrivacyClick={() => navigate('/privacy')}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* SSO Section */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <SSOButtons
                onSSOLogin={handleSSOLogin}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <Button
              variant="link"
              className="text-primary hover:text-primary/80 p-0 h-auto text-sm transition-all duration-200 hover:scale-105"
              onClick={() => navigate('/help')}
            >
              Contact Support
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;