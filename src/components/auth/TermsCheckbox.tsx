import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
  className?: string;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onChange,
  error,
  onTermsClick,
  onPrivacyClick,
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms-accepted"
          checked={checked}
          onCheckedChange={onChange}
          className="mt-1 transition-all duration-200 hover:scale-110"
        />
        <Label htmlFor="terms-accepted" className="text-sm text-muted-foreground leading-relaxed">
          I agree to the{' '}
          <Button
            type="button"
            variant="link"
            className="text-primary hover:text-primary/80 p-0 h-auto text-sm underline transition-all duration-200 hover:scale-105"
            onClick={onTermsClick}
          >
            Terms of Service
          </Button>
          {' '}and{' '}
          <Button
            type="button"
            variant="link"
            className="text-primary hover:text-primary/80 p-0 h-auto text-sm underline transition-all duration-200 hover:scale-105"
            onClick={onPrivacyClick}
          >
            Privacy Policy
          </Button>
        </Label>
      </div>
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TermsCheckbox;