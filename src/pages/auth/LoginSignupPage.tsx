import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Auth Components
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import TermsCheckbox from '@/components/auth/TermsCheckbox';
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
  Shield,
  ArrowRight,
  CheckCircle
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
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle URL parameters to set initial tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setActiveTab('signup');
    } else if (tab === 'login') {
      setActiveTab('login');
    }
  }, [searchParams]);

  // Auth actions
  const { 
    signIn, 
    signUp, 
    isSigningIn, 
    isSigningUp 
  } = useAuthActions();

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  });

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
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="space-y-2 text-center pb-8">
            {/* Logo/Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-scale-in" aria-hidden="true">
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
            {/* Toggle Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg">
                <TabsTrigger 
                  value="login" 
                  className="text-sm font-medium transition-all duration-200 hover:scale-[1.02] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="text-sm font-medium transition-all duration-200 hover:scale-[1.02] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Create Account
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-6" role="tabpanel" aria-labelledby="login-tab">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4" aria-label="Sign in form">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {loginForm.formState.errors.email.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
                        {...loginForm.register('password')}
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
                    {loginForm.formState.errors.password && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {loginForm.formState.errors.password.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        {...loginForm.register('remember_me')}
                        className="transition-all duration-200 hover:scale-110"
                      />
                      <Label htmlFor="remember-me" className="text-sm text-muted-foreground">
                        Remember me
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-primary hover:text-primary/80 p-0 h-auto transition-all duration-200 hover:scale-105"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
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
                        className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
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
                        className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
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
                        className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
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
                        className="pl-10 pr-10 h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
                        {...signupForm.register('password')}
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
                        className="pl-10 pr-10 h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
                        {...signupForm.register('confirm_password')}
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
                    className="w-full h-12 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Create Account</span>
                        <CheckCircle className="w-4 h-4" />
                      </div>
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

              <div className="space-y-3">
                {/* Enterprise SSO Button */}
                <Button
                  variant="outline"
                  className="w-full h-12 text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border-primary/20 hover:border-primary/40"
                  onClick={() => handleSSOLogin('saml')}
                  disabled={isLoading}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Enterprise SSO
                </Button>

                {/* Google Workspace Button */}
                <Button
                  variant="outline"
                  className="w-full h-12 text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border-primary/20 hover:border-primary/40"
                  onClick={() => handleSSOLogin('google')}
                  disabled={isLoading}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Google Workspace
                </Button>
              </div>
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