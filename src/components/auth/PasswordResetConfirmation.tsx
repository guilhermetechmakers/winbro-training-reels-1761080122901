import React from 'react';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Icons
import { 
  CheckCircle,
  ArrowRight,
  Shield
} from 'lucide-react';

interface PasswordResetConfirmationProps {
  onContinue: () => void;
}

const PasswordResetConfirmation: React.FC<PasswordResetConfirmationProps> = ({
  onContinue
}) => {
  return (
    <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm animate-fade-in-up">
      <CardHeader className="space-y-2 text-center pb-8">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        
        <CardTitle className="text-2xl font-bold text-foreground">
          Password Updated Successfully!
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Your password has been reset. You can now sign in with your new password.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Password reset complete</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            You can now sign in to your account using your new password.
          </p>
        </div>

        <Button
          onClick={onContinue}
          className="w-full h-12 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
        >
          <div className="flex items-center space-x-2">
            <span>Continue to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Button>

        {/* Security reminder */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Security reminder:</p>
              <p>Keep your password secure and don't share it with anyone. If you didn't request this password reset, please contact support immediately.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordResetConfirmation;
