import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password, 
  className = "" 
}) => {
  const getStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-error', 'bg-error', 'bg-secondary', 'bg-info', 'bg-success'];
  const strengthTextColors = ['text-error', 'text-error', 'text-secondary', 'text-info', 'text-success'];

  if (!password) return null;

  return (
    <div className={`space-y-2 ${className}`} role="progressbar" aria-label="Password strength">
      <div className="flex space-x-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              level <= strength ? strengthColors[strength - 1] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <p 
        className={`text-xs font-medium transition-colors duration-300 ${
          strength <= 2 ? strengthTextColors[0] : 
          strength <= 3 ? strengthTextColors[1] : 
          strengthTextColors[strength - 1]
        }`}
        aria-live="polite"
      >
        Password strength: {strengthLabels[strength - 1]}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;