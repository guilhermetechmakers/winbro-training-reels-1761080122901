import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SSOButtonProps {
  provider: 'saml' | 'google';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const SSOButton: React.FC<SSOButtonProps> = ({ 
  provider, 
  onClick, 
  disabled = false,
  className = ""
}) => {
  const isSaml = provider === 'saml';
  
  return (
    <Button
      variant="outline"
      className={`w-full h-12 text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Sign in with ${isSaml ? 'Enterprise SSO' : 'Google Workspace'}`}
    >
      <Shield className="w-4 h-4 mr-2" aria-hidden="true" />
      {isSaml ? 'Enterprise SSO' : 'Google Workspace'}
      <ExternalLink className="w-3 h-3 ml-2 opacity-60" aria-hidden="true" />
    </Button>
  );
};

interface SSOButtonsProps {
  onSSOLogin: (provider: 'saml' | 'google') => void;
  disabled?: boolean;
  className?: string;
}

const SSOButtons: React.FC<SSOButtonsProps> = ({ 
  onSSOLogin, 
  disabled = false,
  className = ""
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <SSOButton
        provider="saml"
        onClick={() => onSSOLogin('saml')}
        disabled={disabled}
      />
      <SSOButton
        provider="google"
        onClick={() => onSSOLogin('google')}
        disabled={disabled}
      />
    </div>
  );
};

export default SSOButtons;
export { SSOButton };