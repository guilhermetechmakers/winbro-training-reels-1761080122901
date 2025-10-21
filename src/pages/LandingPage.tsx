import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground">Welcome to Winbro Training Reels</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Your learning platform for professional development
        </p>
      </div>
    </div>
  );
};

export default LandingPage;