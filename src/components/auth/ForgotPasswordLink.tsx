import React from 'react';
import { Button } from '@/components/ui/button';

interface ForgotPasswordLinkProps {
  onClick: () => void;
  className?: string;
}

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ 
  onClick, 
  className = "" 
}) => {
  return (
    <Button
      type="button"
      variant="link"
      className={`text-sm text-primary hover:text-primary/80 p-0 h-auto transition-all duration-200 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      Forgot password?
    </Button>
  );
};

export default ForgotPasswordLink;