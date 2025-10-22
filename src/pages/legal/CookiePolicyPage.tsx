import React from 'react';
import { Download, FileText, Shield, Users, Database, Clock, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CookiePolicyPage: React.FC = () => {
  const handleDownloadPDF = () => {
    // In a real implementation, this would download the actual PDF
    const element = document.createElement('a');
    const file = new Blob(['Cookie Policy PDF content'], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = 'winbro-cookie-policy.pdf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
              Cookie Policy
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up">
              Learn about how Winbro Training Reels uses cookies to enhance your experience and protect your privacy.
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
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Preferences
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
                  This Cookie Policy explains how Winbro Training Reels ("we," "our," or "us") uses cookies and similar technologies 
                  when you visit our website and use our services. By using our platform, you consent to the use of cookies as 
                  described in this policy.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We are committed to transparency about our data practices and giving you control over your privacy preferences. 
                  This policy covers the types of cookies we use, their purposes, and how you can manage them.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* What Are Cookies */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are stored on your device when you visit a website. They help websites 
                  remember information about your visit, such as your preferred language and other settings. This can make 
                  your next visit easier and the site more useful to you.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Types of Cookies:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Persistent Cookies:</strong> Remain on your device for a set period or until deleted</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>First-party Cookies:</strong> Set by our website directly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Third-party Cookies:</strong> Set by other domains we work with</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Cookie Technologies:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Web Beacons:</strong> Small images that track user behavior</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Local Storage:</strong> Browser storage for larger data sets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Session Storage:</strong> Temporary storage for session data</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Types of Cookies We Use */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Types of Cookies We Use
                </CardTitle>
                <CardDescription>
                  We categorize our cookies based on their purpose and necessity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Essential Cookies */}
                <div className="border border-success/20 rounded-lg p-6 bg-success/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Essential Cookies</h3>
                      <p className="text-sm text-muted-foreground">Required for basic website functionality</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">Always Active</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    These cookies are necessary for the website to function and cannot be switched off in our systems. 
                    They are usually only set in response to actions made by you which amount to a request for services.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Examples:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Authentication and security</li>
                        <li>• Load balancing</li>
                        <li>• User interface preferences</li>
                        <li>• Shopping cart functionality</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Retention:</h4>
                      <p className="text-muted-foreground">Session or up to 1 year</p>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-info/20 rounded-lg p-6 bg-info/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                      <Database className="w-4 h-4 text-info" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Analytics Cookies</h3>
                      <p className="text-sm text-muted-foreground">Help us understand how visitors use our website</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">Optional</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    These cookies allow us to count visits and traffic sources so we can measure and improve the performance 
                    of our site. They help us to know which pages are the most and least popular.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Examples:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Google Analytics</li>
                        <li>• Page view tracking</li>
                        <li>• User journey analysis</li>
                        <li>• Performance monitoring</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Retention:</h4>
                      <p className="text-muted-foreground">Up to 2 years</p>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-secondary/20 rounded-lg p-6 bg-secondary/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Marketing Cookies</h3>
                      <p className="text-sm text-muted-foreground">Used to track visitors across websites for advertising</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">Optional</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    These cookies may be set through our site by our advertising partners to build a profile of your interests 
                    and show you relevant adverts on other sites.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Examples:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Social media integration</li>
                        <li>• Advertising networks</li>
                        <li>• Remarketing campaigns</li>
                        <li>• Conversion tracking</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Retention:</h4>
                      <p className="text-muted-foreground">Up to 1 year</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Data Collection and Usage */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="card-elevation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Data Collection and Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">Information We Collect:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Device Information:</strong> Browser type, operating system, device identifiers</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Usage Data:</strong> Pages visited, time spent, click patterns</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Location Data:</strong> General geographic location (country/region)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Preferences:</strong> Language settings, accessibility options</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">How We Use This Data:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Service Delivery:</strong> Provide and maintain our platform</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Personalization:</strong> Customize content and recommendations</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Analytics:</strong> Understand user behavior and improve services</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Security:</strong> Protect against fraud and unauthorized access</span>
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
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Cookie Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Retention Period</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Session Cookies</td>
                        <td className="py-3 px-4 text-muted-foreground">Until browser closes</td>
                        <td className="py-3 px-4 text-muted-foreground">Essential functionality</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Authentication</td>
                        <td className="py-3 px-4 text-muted-foreground">30 days</td>
                        <td className="py-3 px-4 text-muted-foreground">User login state</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Analytics</td>
                        <td className="py-3 px-4 text-muted-foreground">2 years</td>
                        <td className="py-3 px-4 text-muted-foreground">Usage statistics</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Marketing</td>
                        <td className="py-3 px-4 text-muted-foreground">1 year</td>
                        <td className="py-3 px-4 text-muted-foreground">Advertising preferences</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Preferences</td>
                        <td className="py-3 px-4 text-muted-foreground">1 year</td>
                        <td className="py-3 px-4 text-muted-foreground">User settings</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> We may retain certain data for longer periods if required by law or for legitimate 
                    business purposes such as fraud prevention or legal compliance.
                  </p>
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
                  Your Rights and Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  You have several rights regarding the cookies we use and your personal data. You can exercise these rights 
                  at any time through your account settings or by contacting us directly.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Cookie Management:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Opt-out Tools:</strong> Use industry opt-out tools for advertising cookies</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Preference Center:</strong> Manage your cookie preferences in your account</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Data Rights:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Access:</strong> Request a copy of your personal data</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Correction:</strong> Update or correct inaccurate information</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Deletion:</strong> Request deletion of your personal data</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Portability:</strong> Export your data in a machine-readable format</span>
                      </li>
                    </ul>
                  </div>
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
                  Contact Data Controller
                </CardTitle>
                <CardDescription>
                  Get in touch with us about your privacy rights and cookie preferences
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
                    Download Full Cookie Policy (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Updates and Changes */}
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
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
                  operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
                  new Cookie Policy on this page and updating the "Last Updated" date.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We encourage you to review this Cookie Policy periodically to stay informed about our use of cookies 
                  and related technologies. Your continued use of our services after any changes constitutes acceptance 
                  of the updated policy.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;