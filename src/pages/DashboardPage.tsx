import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, User } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your learning overview and quick actions.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>My Courses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Continue your learning journey
              </p>
              <Button asChild className="w-full transition-all duration-200 hover:scale-[1.02]">
                <Link to="/library">View Courses</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Award className="h-5 w-5 text-secondary" />
                <span>Certificates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                View your achievements
              </p>
              <Button asChild variant="outline" className="w-full transition-all duration-200 hover:scale-[1.02]">
                <Link to="/profile">View Certificates</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingUp className="h-5 w-5 text-info" />
                <span>Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Track your progress
              </p>
              <Button asChild variant="outline" className="w-full transition-all duration-200 hover:scale-[1.02]">
                <Link to="/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <User className="h-5 w-5 text-success" />
                <span>Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Manage your account
              </p>
              <Button asChild variant="outline" className="w-full transition-all duration-200 hover:scale-[1.02]">
                <Link to="/profile">View Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest learning activities and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completed: Machine Safety Basics</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-info rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Started: Advanced Manufacturing</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Earned: Safety Certificate</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Your overall learning statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Courses Completed</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Certificates Earned</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Learning Hours</span>
                    <span className="font-medium">45.5</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-info h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;