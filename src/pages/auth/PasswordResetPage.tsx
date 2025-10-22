import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Components
import PasswordResetRequestForm from '@/components/auth/PasswordResetRequestForm';
import PasswordResetConfirmForm from '@/components/auth/PasswordResetConfirmForm';
import PasswordResetConfirmation from '@/components/auth/PasswordResetConfirmation';

// Icons
import { ArrowLeft } from 'lucide-react';

// Button component for back navigation
import { Button } from '@/components/ui/button';

type PasswordResetStep = 'request' | 'confirm' | 'success';

const PasswordResetPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<PasswordResetStep>('request');
  const [resetToken, setResetToken] = useState<string | null>(null);

  // Check for reset token in URL parameters
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setResetToken(token);
      setCurrentStep('confirm');
    }
  }, [searchParams]);

  const handleRequestSuccess = () => {
    // This will be handled by the PasswordResetRequestForm component
    // which shows a success state before transitioning
  };

  const handleConfirmSuccess = () => {
    setCurrentStep('success');
  };

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  const handleContinueToLogin = () => {
    navigate('/auth');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'request':
        return (
          <PasswordResetRequestForm
            onSuccess={handleRequestSuccess}
            onBack={handleBackToLogin}
          />
        );
      case 'confirm':
        if (!resetToken) {
          // If no token, redirect to request step
          setCurrentStep('request');
          return null;
        }
        return (
          <PasswordResetConfirmForm
            token={resetToken}
            onSuccess={handleConfirmSuccess}
            onBack={handleBackToLogin}
          />
        );
      case 'success':
        return (
          <PasswordResetConfirmation
            onContinue={handleContinueToLogin}
          />
        );
      default:
        return (
          <PasswordResetRequestForm
            onSuccess={handleRequestSuccess}
            onBack={handleBackToLogin}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Back Button - only show on confirm and success steps */}
        {(currentStep === 'confirm' || currentStep === 'success') && (
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToLogin}
              className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </div>
        )}

        {/* Render current step */}
        {renderCurrentStep()}

        {/* Footer */}
        <div className="text-center mt-6 animate-fade-in">
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
      </div>
    </div>
  );
};

export default PasswordResetPage;