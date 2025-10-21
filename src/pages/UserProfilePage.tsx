import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Shield, 
  Award, 
  BookOpen, 
  Settings, 
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  QrCode,
  Calendar,
  Clock,
  TrendingUp
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

// Components
import Navigation from '@/components/Navigation';

// Hooks
import { useCurrentUser, useAuthActions } from '@/hooks/useAuth';
import { authToasts } from '@/components/auth/ErrorSuccessToasters';

// Types
import type { Certificate, Course } from '@/types/content';

// Validation schemas
const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  avatar_url: z.string().url().optional().or(z.literal('')),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirm_password: z.string(),
}).refine(data => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.object({
    email: z.boolean(),
    in_app: z.boolean(),
    course_updates: z.boolean(),
    new_content: z.boolean(),
  }),
  language: z.string(),
  timezone: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type PreferencesFormData = z.infer<typeof preferencesSchema>;

// Mock data for demonstration
const mockCertificates: Certificate[] = [
  {
    id: '1',
    user_id: 'user-1',
    course_id: 'course-1',
    certificate_number: 'CERT-2024-001',
    template_id: 'template-1',
    issued_at: '2024-01-15T10:30:00Z',
    expires_at: '2025-01-15T10:30:00Z',
    verification_url: 'https://verify.winbro.com/cert/CERT-2024-001',
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    pdf_url: '/certificates/CERT-2024-001.pdf',
    metadata: {
      user_name: 'John Doe',
      course_title: 'Advanced Manufacturing Safety',
      completion_date: '2024-01-15',
      score: 95,
      organization_name: 'Winbro Manufacturing',
      custom_fields: {}
    }
  },
  {
    id: '2',
    user_id: 'user-1',
    course_id: 'course-2',
    certificate_number: 'CERT-2024-002',
    template_id: 'template-1',
    issued_at: '2024-02-20T14:15:00Z',
    verification_url: 'https://verify.winbro.com/cert/CERT-2024-002',
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    pdf_url: '/certificates/CERT-2024-002.pdf',
    metadata: {
      user_name: 'John Doe',
      course_title: 'Machine Operation Fundamentals',
      completion_date: '2024-02-20',
      score: 88,
      organization_name: 'Winbro Manufacturing',
      custom_fields: {}
    }
  }
];

const mockCourseProgress: Array<Course & { progress: number; last_accessed: string; completed_modules: number; total_modules: number }> = [
  {
    id: 'course-1',
    title: 'Advanced Manufacturing Safety',
    description: 'Comprehensive safety training for manufacturing environments',
    thumbnail_url: '/thumbnails/safety-course.jpg',
    author_id: 'author-1',
    author: { id: 'author-1', name: 'Safety Expert', email: 'instructor@winbro.com', full_name: 'Safety Expert', role: 'trainer' as const, is_verified: true, is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
    status: 'published',
    customer_assignments: ['org-1'],
    modules: [],
    settings: {
      passing_threshold: 80,
      max_attempts: 3,
      is_self_paced: true,
      prerequisites: [],
      visibility: 'organization'
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    published_at: '2024-01-01',
    enrollment_count: 150,
    completion_rate: 85,
    progress: 100,
    last_accessed: '2024-01-15T10:30:00Z',
    completed_modules: 5,
    total_modules: 5
  },
  {
    id: 'course-2',
    title: 'Machine Operation Fundamentals',
    description: 'Learn the basics of operating manufacturing equipment',
    thumbnail_url: '/thumbnails/machine-course.jpg',
    author_id: 'author-2',
    author: { id: 'author-2', name: 'Machine Expert', email: 'instructor2@winbro.com', full_name: 'Machine Expert', role: 'trainer' as const, is_verified: true, is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
    status: 'published',
    customer_assignments: ['org-1'],
    modules: [],
    settings: {
      passing_threshold: 75,
      max_attempts: 5,
      is_self_paced: true,
      prerequisites: [],
      visibility: 'organization'
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    published_at: '2024-01-01',
    enrollment_count: 200,
    completion_rate: 78,
    progress: 60,
    last_accessed: '2024-02-20T14:15:00Z',
    completed_modules: 3,
    total_modules: 5
  }
];

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'certificates' | 'progress'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get current user data
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { signOut } = useAuthActions();

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      avatar_url: user?.avatar_url || '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  // Preferences form
  const preferencesForm = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: user?.preferences?.theme || 'system',
      notifications: {
        email: user?.preferences?.notifications?.email ?? true,
        in_app: user?.preferences?.notifications?.in_app ?? true,
        course_updates: user?.preferences?.notifications?.course_updates ?? true,
        new_content: user?.preferences?.notifications?.new_content ?? true,
      },
      language: user?.preferences?.language || 'en',
      timezone: user?.preferences?.timezone || 'UTC',
    },
  });

  // Form handlers
  const onProfileSubmit = (data: ProfileFormData) => {
    console.log('Profile update:', data);
    authToasts.loginSuccess(); // Replace with actual success toast
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log('Password change:', data);
    authToasts.loginSuccess(); // Replace with actual success toast
    passwordForm.reset();
  };

  const onPreferencesSubmit = (data: PreferencesFormData) => {
    console.log('Preferences update:', data);
    authToasts.loginSuccess(); // Replace with actual success toast
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleCertificateDownload = (certificate: Certificate) => {
    console.log('Download certificate:', certificate.certificate_number);
    // Implement download logic
  };

  const handleCertificateShare = (certificate: Certificate) => {
    console.log('Share certificate:', certificate.certificate_number);
    // Implement share logic
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to load user profile. Please try again.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />
              <AvatarFallback className="text-lg">
                {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {user.full_name || 'User Profile'}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={user.is_verified ? 'default' : 'secondary'}>
                  {user.is_verified ? 'Verified' : 'Unverified'}
                </Badge>
                <Badge variant="outline">
                  {user.role.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Certificates</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="full_name"
                          className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01]"
                          {...profileForm.register('full_name')}
                        />
                      </div>
                      {profileForm.formState.errors.full_name && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            {profileForm.formState.errors.full_name.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01]"
                          {...profileForm.register('email')}
                        />
                      </div>
                      {profileForm.formState.errors.email && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            {profileForm.formState.errors.email.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">Avatar URL</Label>
                    <div className="relative">
                      <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="avatar_url"
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        className="pl-10 h-12 transition-all duration-200 focus:scale-[1.01]"
                        {...profileForm.register('avatar_url')}
                      />
                    </div>
                    {profileForm.formState.errors.avatar_url && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {profileForm.formState.errors.avatar_url.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="submit" className="transition-all duration-200 hover:scale-[1.02]">
                      Update Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Preferences</span>
                </CardTitle>
                <CardDescription>
                  Customize your experience and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={preferencesForm.watch('theme')}
                        onValueChange={(value) => preferencesForm.setValue('theme', value as any)}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={preferencesForm.watch('language')}
                        onValueChange={(value) => preferencesForm.setValue('language', value)}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Notifications</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={preferencesForm.watch('notifications.email')}
                          onCheckedChange={(checked) => 
                            preferencesForm.setValue('notifications.email', checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications within the application
                          </p>
                        </div>
                        <Switch
                          id="in-app-notifications"
                          checked={preferencesForm.watch('notifications.in_app')}
                          onCheckedChange={(checked) => 
                            preferencesForm.setValue('notifications.in_app', checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="course-updates">Course Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about course updates and changes
                          </p>
                        </div>
                        <Switch
                          id="course-updates"
                          checked={preferencesForm.watch('notifications.course_updates')}
                          onCheckedChange={(checked) => 
                            preferencesForm.setValue('notifications.course_updates', checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="new-content">New Content</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about new clips and courses
                          </p>
                        </div>
                        <Switch
                          id="new-content"
                          checked={preferencesForm.watch('notifications.new_content')}
                          onCheckedChange={(checked) => 
                            preferencesForm.setValue('notifications.new_content', checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="submit" className="transition-all duration-200 hover:scale-[1.02]">
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Change Password</span>
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="current_password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="pl-10 pr-10 h-12 transition-all duration-200 focus:scale-[1.01]"
                        {...passwordForm.register('current_password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.current_password && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {passwordForm.formState.errors.current_password.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="new_password"
                        type={showNewPassword ? 'text' : 'password'}
                        className="pl-10 pr-10 h-12 transition-all duration-200 focus:scale-[1.01]"
                        {...passwordForm.register('new_password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.new_password && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {passwordForm.formState.errors.new_password.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="pl-10 pr-10 h-12 transition-all duration-200 focus:scale-[1.01]"
                        {...passwordForm.register('confirm_password')}
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
                    {passwordForm.formState.errors.confirm_password && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {passwordForm.formState.errors.confirm_password.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="submit" className="transition-all duration-200 hover:scale-[1.02]">
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Account Actions</span>
                </CardTitle>
                <CardDescription>
                  Manage your account and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Sign Out</h4>
                    <p className="text-sm text-muted-foreground">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>My Certificates</span>
                </CardTitle>
                <CardDescription>
                  View and manage your earned certificates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockCertificates.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      No certificates yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Complete courses to earn certificates
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockCertificates.map((certificate) => (
                      <Card key={certificate.id} className="hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">
                                {certificate.metadata.course_title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Certificate #{certificate.certificate_number}
                              </p>
                            </div>
                            <Badge variant="default" className="bg-success">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Earned
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              Issued: {new Date(certificate.issued_at).toLocaleDateString()}
                            </div>
                            {certificate.expires_at && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-2" />
                                Expires: {new Date(certificate.expires_at).toLocaleDateString()}
                              </div>
                            )}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Score: {certificate.metadata.score}%
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleCertificateDownload(certificate)}
                              className="flex-1 transition-all duration-200 hover:scale-[1.02]"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCertificateShare(certificate)}
                              className="flex-1 transition-all duration-200 hover:scale-[1.02]"
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(certificate.verification_url, '_blank')}
                              className="transition-all duration-200 hover:scale-[1.02]"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Course Progress</span>
                </CardTitle>
                <CardDescription>
                  Track your learning progress and course completion
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockCourseProgress.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      No courses in progress
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Enroll in courses to start learning
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mockCourseProgress.map((course) => (
                      <Card key={course.id} className="hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                              <BookOpen className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">{course.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {course.description}
                                  </p>
                                </div>
                                <Badge 
                                  variant={course.progress === 100 ? 'default' : 'secondary'}
                                  className={course.progress === 100 ? 'bg-success' : ''}
                                >
                                  {course.progress === 100 ? 'Completed' : 'In Progress'}
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <span>
                                    {course.completed_modules} of {course.total_modules} modules completed
                                  </span>
                                  <span>
                                    Last accessed: {new Date(course.last_accessed).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfilePage;