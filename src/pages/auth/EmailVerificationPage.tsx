import React from 'react';

const EmailVerificationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-foreground text-center mb-6">Verify Email</h1>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <p className="text-muted-foreground text-center">Email verification will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;