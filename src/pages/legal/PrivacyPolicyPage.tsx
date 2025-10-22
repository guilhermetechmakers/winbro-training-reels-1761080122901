import React, { useState } from 'react';
import { Download, FileText, Shield, Users, Database, Clock, Eye, Settings, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const PrivacyPolicyPage: React.FC = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false
  });

  const handleDownloadPDF = () => {
    // In a real implementation, this would download the actual PDF
    const element = document.createElement('a');
    const file = new Blob(['Privacy Policy PDF content'], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = 'winbro-privacy-policy.pdf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Privacy Policy PDF downloaded successfully');
  };

  const handleCookiePreferenceChange = (category: keyof typeof cookiePreferences, value: boolean) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [category]: value
    }));
    
    toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} cookies ${value ? 'enabled' : 'disabled'}`);
  };

  const handleSavePreferences = () => {
    // In a real implementation, this would save preferences to the backend
    localStorage.setItem('cookie-preferences', JSON.stringify(cookiePreferences));
    toast.success('Cookie preferences saved successfully');
  };

  const handleAcceptAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: true,
      marketing: true
    });
    toast.success('All cookies accepted');
  };

  const handleRejectAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: false,
      marketing: false
    });
    toast.success('Non-essential cookies rejected');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 animate-scale-in">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
              Privacy Policy
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up">
              Learn about how Winbro Training Reels collects, uses, and protects your personal information in compliance with data protection regulations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Button 
                onClick={handleDownloadPDF}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-transform duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-transform duration-200"
                onClick={() => document.getElementById('cookie-preferences')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Cookie Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="mb-8 animate-fade-in-up">
            <Alert className="border-info/20 bg-info/5">
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Last Updated:</strong> December 2024 | 
                <strong className="ml-2">Effective Date:</strong> January 1, 2025
              </AlertDescription>
            </Alert>
          </div>

          {/* Introduction */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  At Winbro Training Reels ("we," "our," or "us"), we are committed to protecting your privacy and ensuring 
                  the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and 
                  safeguard your information when you use our microlearning platform and services.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This policy applies to all users of our platform, including operators, technicians, trainers, and customer 
                  administrators. By using our services, you consent to the data practices described in this policy.
                </p>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Key Principles:</strong> We follow industry best practices for data protection, including 
                    data minimization, purpose limitation, and user control over personal information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Information We Collect */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Information We Collect
                </CardTitle>
                <CardDescription>
                  We collect information necessary to provide and improve our services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div className="border border-primary/20 rounded-lg p-6 bg-primary/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Personal Information</h3>
                      <p className="text-sm text-muted-foreground">Information that identifies you directly</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Account Information:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Name and email address</li>
                        <li>• Organization and role</li>
                        <li>• Profile preferences</li>
                        <li>• Authentication credentials</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Contact Information:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Phone number (optional)</li>
                        <li>• Mailing address</li>
                        <li>• Emergency contact details</li>
                        <li>• Communication preferences</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Usage Information */}
                <div className="border border-info/20 rounded-lg p-6 bg-info/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                      <Database className="w-4 h-4 text-info" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Usage Information</h3>
                      <p className="text-sm text-muted-foreground">How you interact with our platform</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Learning Data:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Course progress and completion</li>
                        <li>• Quiz scores and attempts</li>
                        <li>• Video viewing history</li>
                        <li>• Search queries and filters</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Technical Data:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Device information and browser type</li>
                        <li>• IP address and location data</li>
                        <li>• Log files and error reports</li>
                        <li>• Performance metrics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Content Information */}
                <div className="border border-secondary/20 rounded-lg p-6 bg-secondary/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Content Information</h3>
                      <p className="text-sm text-muted-foreground">Information you create or upload</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">User-Generated Content:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Video uploads and metadata</li>
                        <li>• Comments and annotations</li>
                        <li>• Course materials and quizzes</li>
                        <li>• Feedback and reports</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Communication Data:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Support tickets and messages</li>
                        <li>• Email communications</li>
                        <li>• Chat logs and discussions</li>
                        <li>• Survey responses</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* How We Use Information */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">Service Delivery:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Platform Operation:</strong> Provide access to training content and features</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>User Authentication:</strong> Verify identity and manage access</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Content Management:</strong> Organize and deliver personalized content</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Progress Tracking:</strong> Monitor learning progress and completion</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">Service Improvement:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Analytics:</strong> Understand usage patterns and optimize performance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Personalization:</strong> Customize content and recommendations</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Feature Development:</strong> Create new tools and capabilities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Quality Assurance:</strong> Ensure content accuracy and relevance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Cookie Categories and Consent Controls */}
          <section id="cookie-preferences" className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Cookie Categories & Consent Controls
                </CardTitle>
                <CardDescription>
                  Manage your cookie preferences and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Essential Cookies */}
                <div className="border border-success/20 rounded-lg p-6 bg-success/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Essential Cookies</h3>
                        <p className="text-sm text-muted-foreground">Required for basic website functionality</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={cookiePreferences.essential}
                        disabled
                        className="opacity-50"
                      />
                      <Label className="text-sm font-medium">Always Active</Label>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    These cookies are necessary for the website to function and cannot be switched off. 
                    They include authentication, security, and basic functionality cookies.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span>Authentication, security, load balancing, user interface preferences</span>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-info/20 rounded-lg p-6 bg-info/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                        <Database className="w-4 h-4 text-info" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Analytics Cookies</h3>
                        <p className="text-sm text-muted-foreground">Help us understand how visitors use our website</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={cookiePreferences.analytics}
                        onCheckedChange={(value) => handleCookiePreferenceChange('analytics', value)}
                      />
                      <Label className="text-sm font-medium">
                        {cookiePreferences.analytics ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    These cookies allow us to count visits and traffic sources so we can measure and improve 
                    the performance of our site. They help us understand which pages are most popular.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Database className="w-4 h-4" />
                    <span>Google Analytics, page view tracking, user journey analysis, performance monitoring</span>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-secondary/20 rounded-lg p-6 bg-secondary/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Marketing Cookies</h3>
                        <p className="text-sm text-muted-foreground">Used to track visitors across websites for advertising</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={cookiePreferences.marketing}
                        onCheckedChange={(value) => handleCookiePreferenceChange('marketing', value)}
                      />
                      <Label className="text-sm font-medium">
                        {cookiePreferences.marketing ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    These cookies may be set through our site by our advertising partners to build a profile 
                    of your interests and show you relevant adverts on other sites.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Social media integration, advertising networks, remarketing campaigns, conversion tracking</span>
                  </div>
                </div>

                {/* Consent Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                  <Button 
                    onClick={handleAcceptAll}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept All Cookies
                  </Button>
                  <Button 
                    onClick={handleRejectAll}
                    variant="outline"
                    className="border-error text-error hover:bg-error hover:text-error-foreground"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Non-Essential
                  </Button>
                  <Button 
                    onClick={handleSavePreferences}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Data Sharing */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                  except as described in this policy. We may share your information in the following circumstances:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Service Providers:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Cloud Infrastructure:</strong> AWS, Google Cloud for hosting and storage</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Analytics:</strong> Google Analytics for usage insights</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Communication:</strong> SendGrid for email services</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Payment Processing:</strong> Stripe for billing and payments</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Legal Requirements:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Legal Compliance:</strong> When required by law or court order</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Safety Protection:</strong> To protect rights, property, or safety</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Business Transfers:</strong> In connection with mergers or acquisitions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Consent:</strong> When you explicitly consent to sharing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Data Security */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We implement appropriate technical and organizational measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. Our security measures include:
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">Technical Safeguards:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Encryption:</strong> Data encrypted in transit and at rest</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Access Controls:</strong> Role-based access and multi-factor authentication</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Network Security:</strong> Firewalls, intrusion detection, and monitoring</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Regular Updates:</strong> Security patches and system updates</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">Organizational Measures:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-info rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Staff Training:</strong> Regular privacy and security training</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-info rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Data Minimization:</strong> Collect only necessary information</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-info rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Incident Response:</strong> Procedures for security breaches</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-info rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Regular Audits:</strong> Security assessments and compliance reviews</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Your Rights */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Depending on your location, you may have certain rights regarding your personal information. 
                  You can exercise these rights by contacting us or using your account settings.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Access and Control:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Access:</strong> Request a copy of your personal data</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Correction:</strong> Update or correct inaccurate information</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Deletion:</strong> Request deletion of your personal data</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Portability:</strong> Export your data in a machine-readable format</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Consent and Preferences:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Withdraw Consent:</strong> Opt out of certain data processing</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Marketing Preferences:</strong> Control promotional communications</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Cookie Settings:</strong> Manage cookie preferences</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Objection:</strong> Object to certain types of processing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Data Retention */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Data Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Retention Period</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Account Information</td>
                        <td className="py-3 px-4 text-muted-foreground">Until account deletion</td>
                        <td className="py-3 px-4 text-muted-foreground">Service provision</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Learning Progress</td>
                        <td className="py-3 px-4 text-muted-foreground">7 years</td>
                        <td className="py-3 px-4 text-muted-foreground">Compliance and reporting</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Usage Analytics</td>
                        <td className="py-3 px-4 text-muted-foreground">2 years</td>
                        <td className="py-3 px-4 text-muted-foreground">Service improvement</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Communication Logs</td>
                        <td className="py-3 px-4 text-muted-foreground">3 years</td>
                        <td className="py-3 px-4 text-muted-foreground">Support and legal</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Payment Records</td>
                        <td className="py-3 px-4 text-muted-foreground">7 years</td>
                        <td className="py-3 px-4 text-muted-foreground">Financial compliance</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> We may retain certain data for longer periods if required by law, 
                    for legitimate business purposes, or to resolve disputes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact Information */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Get in touch with us about your privacy rights and data protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Winbro Training Reels</h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p><strong>Data Protection Officer:</strong> privacy@winbro.com</p>
                      <p><strong>General Inquiries:</strong> support@winbro.com</p>
                      <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                      <p><strong>Address:</strong> 123 Manufacturing Way, Industrial City, IC 12345</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Response Times</h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p><strong>General Inquiries:</strong> Within 48 hours</p>
                      <p><strong>Privacy Requests:</strong> Within 30 days</p>
                      <p><strong>Data Breaches:</strong> Within 72 hours</p>
                      <p><strong>Cookie Preferences:</strong> Immediate</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="text-center">
                  <Button 
                    onClick={handleDownloadPDF}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Privacy Policy (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Policy Updates */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Policy Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or other factors. We will notify you of any material changes 
                  by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we 
                  protect your information. Your continued use of our services after any changes constitutes 
                  acceptance of the updated policy.
                </p>
                <div className="mt-6 p-4 bg-info/5 border border-info/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Important Notice</h4>
                      <p className="text-sm text-muted-foreground">
                        If we make significant changes to this policy, we will provide additional notice 
                        through email or prominent notice on our website before the changes take effect.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;