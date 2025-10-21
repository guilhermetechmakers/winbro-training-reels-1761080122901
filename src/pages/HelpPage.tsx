import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  Users, 
  Video, 
  Camera, 
  Upload,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  ExternalLink,
  PlayCircle,
  Lightbulb,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContactForm } from '@/hooks/useContactForm';
import { useHelpSearch } from '@/hooks/useHelpSearch';
import type { HelpPageProps } from '@/types/help';

// Local interfaces for the component
interface LocalHelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface LocalFAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface LocalOnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tips: string[];
}

const HelpPage: React.FC<HelpPageProps> = ({ 
  searchQuery: initialSearchQuery = '', 
  activeTab: initialActiveTab = 'documentation' 
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  
  // Use custom hooks
  const contactForm = useContactForm();
  const helpSearch = useHelpSearch();

  // FAQ Data
  const faqData: LocalFAQItem[] = [
    {
      id: '1',
      question: 'How do I upload a new training clip?',
      answer: 'To upload a new training clip, navigate to the Upload page from your dashboard. Drag and drop your video file or click to browse. Ensure your video is between 20-30 seconds and in MP4 format. Fill in the required metadata including machine model, process type, and skill level.',
      category: 'Upload',
      tags: ['upload', 'video', 'metadata']
    },
    {
      id: '2',
      question: 'What video formats are supported?',
      answer: 'We support MP4, MOV, and AVI formats. For best results, use MP4 with H.264 encoding. Maximum file size is 500MB per clip. Videos are automatically transcoded to HLS format for optimal streaming.',
      category: 'Technical',
      tags: ['formats', 'video', 'transcoding']
    },
    {
      id: '3',
      question: 'How do I create a course from my clips?',
      answer: 'Use the Course Builder to create structured training courses. Drag clips into your desired sequence, add quiz questions between modules, and set completion criteria. You can preview the course before publishing and schedule it for specific dates.',
      category: 'Courses',
      tags: ['course', 'builder', 'quiz']
    },
    {
      id: '4',
      question: 'Can I share clips with specific team members?',
      answer: 'Yes, you can assign clips to specific customers or organizations. Use the customer assignment feature when uploading or editing clips. You can also create private collections and share them with selected team members.',
      category: 'Sharing',
      tags: ['sharing', 'permissions', 'teams']
    },
    {
      id: '5',
      question: 'How do I track learner progress?',
      answer: 'The Analytics page provides detailed insights into learner progress, completion rates, and engagement metrics. You can view individual progress, course completion statistics, and generate reports for management.',
      category: 'Analytics',
      tags: ['analytics', 'progress', 'reporting']
    },
    {
      id: '6',
      question: 'What happens if my video fails to process?',
      answer: 'If video processing fails, you\'ll receive a notification with details about the issue. Common causes include unsupported formats, corrupted files, or server issues. You can retry processing or contact support for assistance.',
      category: 'Technical',
      tags: ['processing', 'error', 'support']
    }
  ];

  // Onboarding Steps
  const onboardingSteps: LocalOnboardingStep[] = [
    {
      id: '1',
      title: 'Plan Your Content',
      description: 'Before filming, plan what you want to capture. Focus on specific procedures, safety protocols, or troubleshooting steps.',
      icon: Target,
      tips: [
        'Write a brief script or outline',
        'Identify key points to highlight',
        'Consider your target audience skill level',
        'Plan for good lighting and clear audio'
      ]
    },
    {
      id: '2',
      title: 'Set Up Your Recording',
      description: 'Position your camera or phone to capture the most important details. Ensure good lighting and minimal background noise.',
      icon: Camera,
      tips: [
        'Use landscape orientation for better viewing',
        'Keep the camera steady with a tripod if possible',
        'Ensure the subject fills most of the frame',
        'Test audio quality before recording'
      ]
    },
    {
      id: '3',
      title: 'Record Your Clip',
      description: 'Keep your clip focused and concise. Aim for 20-30 seconds of clear, actionable content.',
      icon: Video,
      tips: [
        'Speak clearly and at a moderate pace',
        'Point out important details as you work',
        'Avoid unnecessary movements or distractions',
        'Record in one continuous take when possible'
      ]
    },
    {
      id: '4',
      title: 'Upload and Describe',
      description: 'Upload your video and provide detailed metadata to help others find and understand your content.',
      icon: Upload,
      tips: [
        'Use descriptive titles and tags',
        'Select the correct machine model and process',
        'Add skill level indicators',
        'Write a brief description of what the clip shows'
      ]
    },
    {
      id: '5',
      title: 'Review and Publish',
      description: 'Review your clip for quality and accuracy before publishing. Make sure it meets your organization\'s standards.',
      icon: CheckCircle,
      tips: [
        'Watch the entire clip before publishing',
        'Verify all metadata is accurate',
        'Check that the content is clear and helpful',
        'Consider getting a second opinion from a colleague'
      ]
    }
  ];

  // Filtered FAQ based on search
  const filteredFAQ = useMemo(() => {
    if (!searchQuery) return faqData;
    
    return faqData.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, faqData]);

  // Group FAQ by category
  const faqByCategory = useMemo(() => {
    const grouped = filteredFAQ.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, LocalFAQItem[]>);
    
    return grouped;
  }, [filteredFAQ]);

  const helpSections: LocalHelpSection[] = [
    {
      id: 'documentation',
      title: 'Documentation',
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex-1">
              <Input
                placeholder="Search documentation..."
                value={helpSearch.query}
                onChange={(e) => helpSearch.setQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Search Results */}
          {helpSearch.query && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search Results</span>
                  {helpSearch.loading && <span className="text-sm text-muted-foreground">(Loading...)</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {helpSearch.error ? (
                  <p className="text-error">{helpSearch.error}</p>
                ) : helpSearch.results.length === 0 ? (
                  <p className="text-muted-foreground">No results found for "{helpSearch.query}"</p>
                ) : (
                  <div className="space-y-3">
                    {helpSearch.results.map((result) => (
                      <div key={result.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{result.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{result.content}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {result.type}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {result.category}
                              </Badge>
                              {result.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground ml-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Getting Started',
                description: 'Learn the basics of Winbro Training Reels',
                icon: PlayCircle,
                color: 'text-primary',
                bgColor: 'bg-primary/10',
                topics: ['Account Setup', 'First Upload', 'Navigation', 'Basic Features']
              },
              {
                title: 'Content Creation',
                description: 'Best practices for creating training content',
                icon: Video,
                color: 'text-info',
                bgColor: 'bg-info/10',
                topics: ['Recording Tips', 'Video Quality', 'Metadata', 'Organization']
              },
              {
                title: 'Course Building',
                description: 'Create structured learning experiences',
                icon: BookOpen,
                color: 'text-success',
                bgColor: 'bg-success/10',
                topics: ['Course Structure', 'Quiz Creation', 'Publishing', 'Management']
              },
              {
                title: 'User Management',
                description: 'Manage users and permissions',
                icon: Users,
                color: 'text-secondary',
                bgColor: 'bg-secondary/10',
                topics: ['User Roles', 'Permissions', 'Invitations', 'Access Control']
              },
              {
                title: 'Analytics & Reports',
                description: 'Track progress and generate insights',
                icon: Target,
                color: 'text-accent',
                bgColor: 'bg-accent/10',
                topics: ['Progress Tracking', 'Usage Reports', 'Performance Metrics', 'Export Data']
              },
              {
                title: 'Technical Support',
                description: 'Troubleshooting and technical help',
                icon: Shield,
                color: 'text-error',
                bgColor: 'bg-error/10',
                topics: ['System Requirements', 'Troubleshooting', 'API Documentation', 'Integrations']
              }
            ].map((section, index) => (
              <Card 
                key={section.title}
                className="hover:shadow-elevation-200 transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={cn('p-2 rounded-lg', section.bgColor)}>
                      <section.icon className={cn('h-5 w-5', section.color)} />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {section.topics.map((topic) => (
                      <div key={topic} className="flex items-center space-x-2 text-sm">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                          {topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {Object.keys(faqByCategory).length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? 'No FAQs found' : 'No FAQs available'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Try adjusting your search terms or browse all categories.'
                    : 'FAQs will be available soon. Check back later or contact support for immediate help.'
                  }
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(faqByCategory).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {category}
                    </Badge>
                    <span className="text-muted-foreground">
                      {items.length} question{items.length !== 1 ? 's' : ''}
                    </span>
                  </h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {items.map((item) => (
                      <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{item.question}</span>
                            <div className="flex space-x-1">
                              {item.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pt-2">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'onboarding',
      title: 'Capture Guide',
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">How to Create Great Training Clips</h2>
            <p className="text-lg text-muted-foreground">
              Follow our step-by-step guide to create effective, professional training content that your team will love.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {onboardingSteps.map((step) => (
              <Card key={step.id} className="hover:shadow-elevation-200 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Step {step.id}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-foreground">Pro Tips:</h4>
                    <ul className="space-y-2">
                      {step.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-primary/5 to-info/5 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Upload your first training clip and start building your organization's knowledge base.
            </p>
            <Button size="lg" className="group">
              Start Creating
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact Support',
      icon: MessageSquare,
      content: (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Get Help When You Need It</h2>
            <p className="text-lg text-muted-foreground">
              Our support team is here to help you succeed. Choose the best way to reach us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-elevation-200 transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send us a detailed message and we'll get back to you within 24 hours.
                </p>
                <Button variant="outline" className="w-full">
                  support@winbro.com
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-elevation-200 transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-info" />
                </div>
                <CardTitle>Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Call us during business hours for immediate assistance.
                </p>
                <Button variant="outline" className="w-full">
                  +1 (555) 123-4567
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-elevation-200 transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-success" />
                </div>
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Chat with our support team in real-time for quick answers.
                </p>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={(e) => { 
                  e.preventDefault(); 
                  contactForm.submit(); 
                }} 
                className="space-y-6"
                noValidate
                aria-label="Contact support form"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="text-sm font-medium mb-2 block">Name *</label>
                    <Input 
                      id="contact-name"
                      placeholder="Your full name" 
                      value={contactForm.formState.data.name}
                      onChange={(e) => contactForm.updateField('name', e.target.value)}
                      className={contactForm.formState.errors.name ? 'border-error' : ''}
                      aria-invalid={!!contactForm.formState.errors.name}
                      aria-describedby={contactForm.formState.errors.name ? 'name-error' : undefined}
                    />
                    {contactForm.formState.errors.name && (
                      <p id="name-error" className="text-sm text-error mt-1" role="alert">
                        {contactForm.formState.errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="text-sm font-medium mb-2 block">Email *</label>
                    <Input 
                      id="contact-email"
                      type="email" 
                      placeholder="your.email@company.com" 
                      value={contactForm.formState.data.email}
                      onChange={(e) => contactForm.updateField('email', e.target.value)}
                      className={contactForm.formState.errors.email ? 'border-error' : ''}
                      aria-invalid={!!contactForm.formState.errors.email}
                      aria-describedby={contactForm.formState.errors.email ? 'email-error' : undefined}
                    />
                    {contactForm.formState.errors.email && (
                      <p id="email-error" className="text-sm text-error mt-1" role="alert">
                        {contactForm.formState.errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="text-sm font-medium mb-2 block">Subject *</label>
                  <Input 
                    id="contact-subject"
                    placeholder="Brief description of your issue" 
                    value={contactForm.formState.data.subject}
                    onChange={(e) => contactForm.updateField('subject', e.target.value)}
                    className={contactForm.formState.errors.subject ? 'border-error' : ''}
                    aria-invalid={!!contactForm.formState.errors.subject}
                    aria-describedby={contactForm.formState.errors.subject ? 'subject-error' : undefined}
                  />
                  {contactForm.formState.errors.subject && (
                    <p id="subject-error" className="text-sm text-error mt-1" role="alert">
                      {contactForm.formState.errors.subject}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact-message" className="text-sm font-medium mb-2 block">Message *</label>
                  <textarea 
                    id="contact-message"
                    className={`w-full min-h-[120px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring ${
                      contactForm.formState.errors.message ? 'border-error' : 'border-input'
                    }`}
                    placeholder="Please provide as much detail as possible about your question or issue..."
                    value={contactForm.formState.data.message}
                    onChange={(e) => contactForm.updateField('message', e.target.value)}
                    aria-invalid={!!contactForm.formState.errors.message}
                    aria-describedby={contactForm.formState.errors.message ? 'message-error' : undefined}
                  />
                  {contactForm.formState.errors.message && (
                    <p id="message-error" className="text-sm text-error mt-1" role="alert">
                      {contactForm.formState.errors.message}
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={contactForm.formState.isSubmitting || !contactForm.formState.isValid}
                >
                  {contactForm.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'about',
      title: 'About Winbro',
      icon: Users,
      content: (
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">About Winbro Training Reels</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're revolutionizing industrial training by replacing paper manuals and tribal knowledge 
              with searchable, verified video clips and structured learning experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Our Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To empower manufacturing teams with accessible, searchable training content that 
                  improves safety, efficiency, and knowledge retention across all skill levels.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-info" />
                  <span>Our Vision</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A world where every manufacturing worker has instant access to the knowledge 
                  they need, when they need it, through intuitive video-based learning.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Winbro?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Microlearning Focus</h4>
                <p className="text-sm text-muted-foreground">
                  20-30 second clips that deliver focused, actionable knowledge
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-info" />
                </div>
                <h4 className="font-semibold mb-2">Searchable Content</h4>
                <p className="text-sm text-muted-foreground">
                  Find exactly what you need with powerful search and filtering
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-success" />
                </div>
                <h4 className="font-semibold mb-2">Enterprise Ready</h4>
                <p className="text-sm text-muted-foreground">
                  Secure, scalable platform designed for industrial environments
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">Ready to Transform Your Training?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of manufacturing companies already using Winbro Training Reels 
              to improve their training programs and empower their workforce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Help & Support
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to get the most out of Winbro Training Reels. 
            Find answers, learn best practices, and get support when you need it.
          </p>
        </header>

        {/* Main Content */}
        <main>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8" role="tablist">
              {helpSections.map((section) => (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id}
                  className="flex items-center space-x-2"
                  role="tab"
                  aria-selected={activeTab === section.id}
                  aria-controls={`tabpanel-${section.id}`}
                >
                  <section.icon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{section.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          
            {helpSections.map((section) => (
              <TabsContent 
                key={section.id} 
                value={section.id} 
                className="mt-0"
                role="tabpanel"
                id={`tabpanel-${section.id}`}
                aria-labelledby={`tab-${section.id}`}
              >
                <div className="animate-fade-in">
                  {section.content}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default HelpPage;