import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home, HelpCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Retry the last action by refreshing the page
    window.location.reload();
  };

  const handleGoBack = () => {
    // Go back to previous page
    navigate(-1);
  };

  const handleReportIssue = () => {
    // In a real app, this would open a support ticket or contact form
    // For now, we'll show an alert
    alert('Issue reporting feature would open here. Please contact support at support@winbro.com');
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4"
      role="main"
      aria-labelledby="error-title"
    >
      <div className="w-full max-w-2xl">
        {/* Main Error Card */}
        <Card className="card-elevation border-error/20 shadow-2xl">
          <CardHeader className="text-center pb-6">
            {/* Error Icon with Animation */}
            <div 
              className="mx-auto mb-6 w-20 h-20 bg-error/10 rounded-full flex items-center justify-center animate-pulse-slow"
              aria-hidden="true"
            >
              <AlertTriangle className="w-10 h-10 text-error" />
            </div>
            
            {/* Error Code */}
            <CardTitle 
              id="error-title"
              className="text-6xl font-bold text-error mb-2 animate-fade-in"
              aria-label="Error code 500"
            >
              500
            </CardTitle>
            
            {/* Error Title */}
            <CardTitle className="text-2xl font-semibold text-foreground mb-3">
              Internal Server Error
            </CardTitle>
            
            {/* Error Description */}
            <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
              Something went wrong on our end. We're working to fix this issue and get you back on track.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            <Alert className="border-error/20 bg-error/5" role="alert">
              <AlertTriangle className="h-4 w-4 text-error" aria-hidden="true" />
              <AlertDescription className="text-sm">
                This error has been automatically reported to our technical team. 
                If this persists, please contact support.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleRetry}
                className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                size="lg"
                aria-label="Retry the last action by refreshing the page"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </Button>
              
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                size="lg"
                aria-label="Go back to the previous page"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Go Back
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-border">
              <Button 
                asChild
                variant="ghost"
                className="flex items-center gap-2 hover:bg-muted/50 transition-colors"
                aria-label="Navigate to the home page"
              >
                <Link to="/">
                  <Home className="w-4 h-4" aria-hidden="true" />
                  Go Home
                </Link>
              </Button>
              
              <Button 
                onClick={handleReportIssue}
                variant="ghost"
                className="flex items-center gap-2 hover:bg-muted/50 transition-colors"
                aria-label="Report this issue to support"
              >
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
                Report Issue
              </Button>
            </div>

            {/* Support Information */}
            <div className="text-center pt-6">
              <p className="text-sm text-muted-foreground mb-2">
                Need immediate assistance?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
                <a 
                  href="mailto:support@winbro.com" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                  aria-label="Send email to support at support@winbro.com"
                >
                  support@winbro.com
                </a>
                <span className="hidden sm:inline text-muted-foreground" aria-hidden="true">•</span>
                <a 
                  href="tel:+1-800-WINBRO-1" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                  aria-label="Call support at 1-800-WINBRO-1"
                >
                  +1-800-WINBRO-1
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help Section */}
        <Card className="mt-6 card-elevation">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
              What you can do:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Immediate Actions</h4>
                <ul className="space-y-1 text-muted-foreground" role="list">
                  <li>• Refresh the page to try again</li>
                  <li>• Check your internet connection</li>
                  <li>• Clear your browser cache</li>
                  <li>• Try a different browser</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">If Problem Persists</h4>
                <ul className="space-y-1 text-muted-foreground" role="list">
                  <li>• Contact our support team</li>
                  <li>• Check our status page</li>
                  <li>• Report the issue with details</li>
                  <li>• Try again in a few minutes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} • 
            Timestamp: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;