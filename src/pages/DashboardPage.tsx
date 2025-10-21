import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-foreground mb-2">My Courses</h2>
            <p className="text-muted-foreground">View your enrolled courses</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-foreground mb-2">Recent Activity</h2>
            <p className="text-muted-foreground">Track your learning progress</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-foreground mb-2">Achievements</h2>
            <p className="text-muted-foreground">View your certificates and badges</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;