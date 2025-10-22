import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Video, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Settings,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  Database,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardPageProps {}

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface ChartData {
  name: string;
  value?: number;
  clips?: number;
  users?: number;
  courses?: number;
  [key: string]: any;
}

interface RecentActivity {
  id: string;
  type: 'upload' | 'user' | 'course' | 'certificate' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  user?: string;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for metrics
  const metrics: MetricCard[] = [
    {
      id: '1',
      title: 'Total Clips',
      value: '2,847',
      change: 12.5,
      changeType: 'increase',
      icon: Video,
      color: 'text-primary',
      description: 'Microlearning videos published'
    },
    {
      id: '2',
      title: 'Active Users',
      value: '1,247',
      change: 8.2,
      changeType: 'increase',
      icon: Users,
      color: 'text-success',
      description: 'Users active in last 30 days'
    },
    {
      id: '3',
      title: 'Courses Created',
      value: '156',
      change: -2.1,
      changeType: 'decrease',
      icon: FileText,
      color: 'text-secondary',
      description: 'Training courses published'
    },
    {
      id: '4',
      title: 'Certificates Issued',
      value: '3,421',
      change: 15.7,
      changeType: 'increase',
      icon: CheckCircle,
      color: 'text-info',
      description: 'Certificates generated this month'
    },
    {
      id: '5',
      title: 'Storage Used',
      value: '45.2 GB',
      change: 5.3,
      changeType: 'increase',
      icon: Database,
      color: 'text-warning',
      description: 'Total storage consumption'
    },
    {
      id: '6',
      title: 'System Uptime',
      value: '99.9%',
      change: 0.1,
      changeType: 'increase',
      icon: Activity,
      color: 'text-success',
      description: 'Platform availability'
    }
  ];

  // Mock chart data
  const usageData: ChartData[] = [
    { name: 'Jan', clips: 120, users: 800, courses: 12 },
    { name: 'Feb', clips: 190, users: 950, courses: 18 },
    { name: 'Mar', clips: 300, users: 1100, courses: 25 },
    { name: 'Apr', clips: 280, users: 1050, courses: 22 },
    { name: 'May', clips: 189, users: 1200, courses: 30 },
    { name: 'Jun', clips: 239, users: 1300, courses: 35 },
    { name: 'Jul', clips: 349, users: 1400, courses: 42 }
  ];

  const storageData: ChartData[] = [
    { name: 'Video Content', value: 65, color: '#0B6B6F' },
    { name: 'User Data', value: 20, color: '#F3A712' },
    { name: 'Analytics', value: 10, color: '#2F3A44' },
    { name: 'System Files', value: 5, color: '#2E8B57' }
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'upload',
      title: 'New clip uploaded',
      description: 'CNC Safety Procedures by John Smith',
      timestamp: '2 minutes ago',
      status: 'success',
      user: 'John Smith'
    },
    {
      id: '2',
      type: 'user',
      title: 'New user registered',
      description: 'Sarah Johnson joined Acme Manufacturing',
      timestamp: '15 minutes ago',
      status: 'info',
      user: 'Sarah Johnson'
    },
    {
      id: '3',
      type: 'course',
      title: 'Course published',
      description: 'Advanced Machining Techniques',
      timestamp: '1 hour ago',
      status: 'success',
      user: 'Mike Wilson'
    },
    {
      id: '4',
      type: 'certificate',
      title: 'Certificate issued',
      description: 'Safety Training Certificate for 15 users',
      timestamp: '2 hours ago',
      status: 'success'
    },
    {
      id: '5',
      type: 'system',
      title: 'System maintenance',
      description: 'Scheduled maintenance completed',
      timestamp: '3 hours ago',
      status: 'info'
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Dashboard data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-secondary" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-error" />;
      case 'info':
        return <Clock className="h-4 w-4 text-info" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Video className="h-4 w-4 text-primary" />;
      case 'user':
        return <Users className="h-4 w-4 text-success" />;
      case 'course':
        return <FileText className="h-4 w-4 text-secondary" />;
      case 'certificate':
        return <CheckCircle className="h-4 w-4 text-info" />;
      case 'system':
        return <Settings className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Platform overview, metrics, and management tools
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Status Banner */}
        <Card className="mb-6 border-l-4 border-l-success shadow-elevation-100 bg-gradient-to-r from-success/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-sm font-medium">
                All systems operational. Last updated: {new Date().toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.id} className="hover:shadow-elevation-200 transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-lg bg-muted/50", metric.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {metric.changeType === 'increase' ? (
                        <ArrowUpRight className="h-4 w-4 text-success" />
                      ) : metric.changeType === 'decrease' ? (
                        <ArrowDownRight className="h-4 w-4 text-error" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        metric.changeType === 'increase' && "text-success",
                        metric.changeType === 'decrease' && "text-error",
                        metric.changeType === 'neutral' && "text-muted-foreground"
                      )}>
                        {metric.change > 0 && '+'}{metric.change}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-foreground">{metric.value}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/50 rounded-xl p-1 h-auto">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg transition-all duration-200 p-3"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg transition-all duration-200 p-3"
            >
              <Video className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg transition-all duration-200 p-3"
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg transition-all duration-200 p-3"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Trends Chart */}
              <Card className="shadow-elevation-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Usage Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="clips" 
                        stackId="1" 
                        stroke="#0B6B6F" 
                        fill="#0B6B6F" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="users" 
                        stackId="1" 
                        stroke="#F3A712" 
                        fill="#F3A712" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="courses" 
                        stackId="1" 
                        stroke="#2F3A44" 
                        fill="#2F3A44" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Storage Distribution */}
              <Card className="shadow-elevation-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-primary" />
                    <span>Storage Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={storageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {storageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {storageData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-elevation-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                          {getStatusIcon(activity.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>{activity.timestamp}</span>
                          {activity.user && <span>by {activity.user}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-elevation-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-primary" />
                    <span>Content Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Published Clips</span>
                    <Badge className="bg-success/10 text-success border-success/20">2,456</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Review</span>
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20">23</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Draft Clips</span>
                    <Badge className="bg-muted/10 text-muted-foreground border-muted/20">89</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Archived</span>
                    <Badge className="bg-error/10 text-error border-error/20">12</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elevation-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Course Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Courses</span>
                    <Badge className="bg-success/10 text-success border-success/20">142</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Development</span>
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20">14</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <Badge className="bg-info/10 text-info border-info/20">3,421</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Duration</span>
                    <Badge className="bg-muted/10 text-muted-foreground border-muted/20">24 min</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elevation-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Moderation Queue</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Review</span>
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20">8</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Flagged Content</span>
                    <Badge className="bg-error/10 text-error border-error/20">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resolved Today</span>
                    <Badge className="bg-success/10 text-success border-success/20">15</Badge>
                  </div>
                  <Button className="w-full hover:scale-105 transition-all duration-200">
                    <Eye className="h-4 w-4 mr-2" />
                    Review Queue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-elevation-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>User Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#0B6B6F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-elevation-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>User Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Users</span>
                    <Badge className="bg-primary/10 text-primary border-primary/20">1,247</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Today</span>
                    <Badge className="bg-success/10 text-success border-success/20">892</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New This Week</span>
                    <Badge className="bg-info/10 text-info border-info/20">45</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Suspended</span>
                    <Badge className="bg-error/10 text-error border-error/20">3</Badge>
                  </div>
                  <Button className="w-full hover:scale-105 transition-all duration-200">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-elevation-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="clips" stroke="#0B6B6F" strokeWidth={2} />
                      <Line type="monotone" dataKey="users" stroke="#F3A712" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-elevation-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>System Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <Badge className="bg-success/10 text-success border-success/20">45ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Performance</span>
                    <Badge className="bg-success/10 text-success border-success/20">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CDN Status</span>
                    <Badge className="bg-success/10 text-success border-success/20">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <Badge className="bg-success/10 text-success border-success/20">0.02%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardPage;