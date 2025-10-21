import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the combined auth page with signup tab active
    navigate('/auth?tab=signup', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Redirecting to signup...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;