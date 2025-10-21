import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  RefreshCw, 
  Settings,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  Users,
  Building2,
  Clock,
  Video,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminDashboard, useKPIs, useCharts, useOutstandingTasks, useCustomers } from '@/hooks/useAdminDashboard';
import KPICards from '@/components/admin-dashboard/KPICards';
import Charts from '@/components/admin-dashboard/Charts';
import OutstandingTasks from '@/components/admin-dashboard/OutstandingTasks';
import CustomerListQuickLinks from '@/components/admin-dashboard/CustomerListQuickLinks';
import type { OutstandingTask, CustomerSummary } from '@/types/admin';

const AdminDashboardPage: React.FC = () => {
  const { isLoading: dashboardLoading, refetch: refetchDashboard } = useAdminDashboard();
  const { data: kpiData, isLoading: kpiLoading } = useKPIs();
  const { data: chartsData, isLoading: chartsLoading } = useCharts('overview');
  const { data: tasksData, isLoading: tasksLoading } = useOutstandingTasks();
  const { data: customersData, isLoading: customersLoading } = useCustomers();

  const handleTaskClick = (task: OutstandingTask) => {
    console.log('Task clicked:', task);
    // Navigate to task detail or open modal
  };

  const handleTaskAction = (taskId: string, action: string) => {
    console.log('Task action:', taskId, action);
    // Handle task action (start, complete, etc.)
  };

  const handleCustomerClick = (customer: CustomerSummary) => {
    console.log('Customer clicked:', customer);
    // Navigate to customer detail
  };

  const handleManageCustomer = (customer: CustomerSummary) => {
    console.log('Manage customer:', customer);
    // Open customer management modal
  };

  const handleRefresh = () => {
    refetchDashboard();
  };

  const handleExport = () => {
    console.log('Export dashboard data');
    // Handle export functionality
  };

  const handleSettings = () => {
    console.log('Open dashboard settings');
    // Open settings modal
  };

  const isLoading = dashboardLoading || kpiLoading || chartsLoading || tasksLoading || customersLoading;

  // Mock data for demonstration - in real app this would come from API
  const mockKPIData = {
    clipsPublished: 1247,
    viewsLast30d: 45632,
    activeUsers: 892,
    certificatesIssued: 234,
    clipsPublishedChange: 12.5,
    viewsLast30dChange: 8.3,
    activeUsersChange: 15.2,
    certificatesIssuedChange: 22.1
  };

  const mockChartsData = [
    {
      id: 'daily-views',
      title: 'Daily Views',
      type: 'line' as const,
      data: [
        { date: '2024-01-01', value: 1200, label: 'Jan 1' },
        { date: '2024-01-02', value: 1350, label: 'Jan 2' },
        { date: '2024-01-03', value: 1180, label: 'Jan 3' },
        { date: '2024-01-04', value: 1420, label: 'Jan 4' },
        { date: '2024-01-05', value: 1680, label: 'Jan 5' },
        { date: '2024-01-06', value: 1950, label: 'Jan 6' },
        { date: '2024-01-07', value: 2100, label: 'Jan 7' }
      ],
      color: '#0B6B6F'
    },
    {
      id: 'uploads',
      title: 'Content Uploads',
      type: 'bar' as const,
      data: [
        { date: '2024-01-01', value: 45, label: 'Jan 1' },
        { date: '2024-01-02', value: 52, label: 'Jan 2' },
        { date: '2024-01-03', value: 38, label: 'Jan 3' },
        { date: '2024-01-04', value: 61, label: 'Jan 4' },
        { date: '2024-01-05', value: 48, label: 'Jan 5' },
        { date: '2024-01-06', value: 55, label: 'Jan 6' },
        { date: '2024-01-07', value: 67, label: 'Jan 7' }
      ],
      color: '#F3A712'
    }
  ];

  const mockTasksData = [
    {
      id: '1',
      type: 'review' as const,
      title: 'Review pending clips',
      description: '15 clips waiting for review and approval',
      priority: 'high' as const,
      status: 'pending' as const,
      assignedTo: 'John Doe',
      createdAt: '2024-01-07T10:00:00Z',
      dueDate: '2024-01-08T18:00:00Z'
    },
    {
      id: '2',
      type: 'flagged' as const,
      title: 'Flagged content review',
      description: '3 clips reported by users need attention',
      priority: 'urgent' as const,
      status: 'in_progress' as const,
      assignedTo: 'Jane Smith',
      createdAt: '2024-01-07T09:30:00Z',
      dueDate: '2024-01-07T17:00:00Z'
    },
    {
      id: '3',
      type: 'moderation' as const,
      title: 'Content moderation queue',
      description: '8 items in moderation queue',
      priority: 'medium' as const,
      status: 'pending' as const,
      assignedTo: 'Mike Johnson',
      createdAt: '2024-01-07T08:15:00Z',
      dueDate: '2024-01-09T12:00:00Z'
    }
  ];

  const mockCustomersData = [
    {
      id: '1',
      name: 'Acme Manufacturing',
      organizationId: 'org-1',
      status: 'active' as const,
      userCount: 45,
      clipCount: 234,
      courseCount: 12,
      lastActivity: '2024-01-07T14:30:00Z',
      subscriptionTier: 'enterprise' as const,
      storageUsed: 125.6,
      monthlyUsage: 2340,
      createdAt: '2023-06-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'TechCorp Industries',
      organizationId: 'org-2',
      status: 'active' as const,
      userCount: 28,
      clipCount: 156,
      courseCount: 8,
      lastActivity: '2024-01-07T11:20:00Z',
      subscriptionTier: 'professional' as const,
      storageUsed: 89.3,
      monthlyUsage: 1870,
      createdAt: '2023-08-22T00:00:00Z'
    },
    {
      id: '3',
      name: 'Global Solutions Ltd',
      organizationId: 'org-3',
      status: 'trial' as const,
      userCount: 12,
      clipCount: 45,
      courseCount: 3,
      lastActivity: '2024-01-06T16:45:00Z',
      subscriptionTier: 'basic' as const,
      storageUsed: 23.7,
      monthlyUsage: 420,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Platform overview and management tools
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSettings}
              className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Status Banner */}
        <Card className="mb-6 border-l-4 border-l-success shadow-elevation-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-success" />
              <span className="text-sm font-medium">System Status: All systems operational</span>
              <Badge variant="secondary" className="ml-auto">
                Last updated: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="mb-8">
          <KPICards 
            data={kpiData || mockKPIData} 
            isLoading={kpiLoading}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Video className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building2 className="h-4 w-4 mr-2" />
              Customers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Charts */}
            <Charts 
              data={chartsData || mockChartsData} 
              isLoading={chartsLoading}
            />
            
            {/* Outstanding Tasks */}
            <OutstandingTasks
              data={tasksData || mockTasksData}
              isLoading={tasksLoading}
              onTaskClick={handleTaskClick}
              onTaskAction={handleTaskAction}
            />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-elevation-200 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Content Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Content analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-elevation-200 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Activity feed coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-elevation-200 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>User Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">User management tools coming soon</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-elevation-200 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>User Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">User activity analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerListQuickLinks
              data={customersData || mockCustomersData}
              isLoading={customersLoading}
              onCustomerClick={handleCustomerClick}
              onManageCustomer={handleManageCustomer}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8 shadow-elevation-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary transition-all duration-200 hover:scale-105"
              >
                <Users className="h-6 w-6" />
                <span className="text-sm font-medium">Manage Users</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary transition-all duration-200 hover:scale-105"
              >
                <Building2 className="h-6 w-6" />
                <span className="text-sm font-medium">Organizations</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary transition-all duration-200 hover:scale-105"
              >
                <Filter className="h-6 w-6" />
                <span className="text-sm font-medium">Moderation</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary transition-all duration-200 hover:scale-105"
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm font-medium">Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;