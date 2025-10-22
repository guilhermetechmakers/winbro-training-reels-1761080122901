import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Home, 
  Search, 
  ArrowLeft, 
  HelpCircle, 
  BookOpen, 
  Video, 
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/library?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickLinks = [
    {
      title: 'Dashboard',
      description: 'View your training progress and activities',
      href: '/dashboard',
      icon: Home,
      color: 'text-primary'
    },
    {
      title: 'Content Library',
      description: 'Browse training clips and courses',
      href: '/library',
      icon: BookOpen,
      color: 'text-info'
    },
    {
      title: 'Upload Content',
      description: 'Add new training materials',
      href: '/upload',
      icon: Video,
      color: 'text-success'
    },
    {
      title: 'Help Center',
      description: 'Get support and documentation',
      href: '/help',
      icon: HelpCircle,
      color: 'text-secondary'
    }
  ];

  const popularPages = [
    { name: 'Course Builder', href: '/course-builder' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Settings', href: '/settings' },
    { name: 'User Management', href: '/admin/users' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-primary-foreground" />
              </div>
              <span>Winbro Training</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl w-full">
            {/* Hero Section */}
            <div className="text-center mb-12">
              {/* Animated 404 Number */}
              <div className="relative mb-8">
                <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-bounce-in">
                  404
                </h1>
                <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-primary/10 animate-pulse">
                  404
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in-up">
                Oops! Page Not Found
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
                The page you're looking for seems to have vanished into the digital void. 
                Don't worry, even the best training materials sometimes get misplaced!
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 animate-fade-in-up delay-300">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for training content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in-up delay-400">
              {quickLinks.map((link) => (
                <Card 
                  key={link.title}
                  className="group hover:shadow-elevation-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
                  onClick={() => navigate(link.href)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <link.icon className={`w-6 h-6 ${link.color}`} />
                    </div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center text-sm">
                      {link.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Popular Pages */}
            <Card className="mb-8 animate-fade-in-up delay-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-secondary" />
                  <span>Popular Pages</span>
                </CardTitle>
                <CardDescription>
                  Here are some pages you might be looking for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {popularPages.map((page) => (
                    <Button
                      key={page.name}
                      variant="outline"
                      className="justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                      onClick={() => navigate(page.href)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{page.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-600">
              <Button
                size="lg"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-8 py-3 text-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh Page
              </Button>
            </div>

            {/* Help Section */}
            <div className="mt-12 text-center animate-fade-in-up delay-700">
              <p className="text-muted-foreground mb-4">
                Still can't find what you're looking for?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/help')}
                  className="flex items-center space-x-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Contact Support</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/library')}
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Library</span>
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 border-t border-border/50">
          <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
            <p>
              © 2024 Winbro Training Reels. All rights reserved. | 
              <Link to="/privacy" className="hover:text-primary transition-colors ml-1">Privacy Policy</Link> | 
              <Link to="/terms" className="hover:text-primary transition-colors ml-1">Terms of Service</Link>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NotFoundPage;