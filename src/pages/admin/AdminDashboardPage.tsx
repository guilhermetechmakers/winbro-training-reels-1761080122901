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
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminDashboard, useKPIs, useCharts, useOutstandingTasks, useCustomers } from '@/hooks/useAdminDashboard';
import KPICards from '@/components/admin-dashboard/KPICards';
import Charts from '@/components/admin-dashboard/Charts';
import OutstandingTasks from '@/components/admin-dashboard/OutstandingTasks';
import CustomerListQuickLinks from '@/components/admin-dashboard/CustomerListQuickLinks';
import type { OutstandingTask, CustomerSummary } from '@/types/admin';

const AdminDashboardPage: React.FC = () => {
  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useAdminDashboard();
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSettings}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Status Banner */}
        {dashboardData && (
          <Card className="mb-6 border-l-4 border-l-success">
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
        )}

        {/* KPI Cards */}
        <div className="mb-8">
          <KPICards 
            data={kpiData} 
            isLoading={kpiLoading}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Charts */}
            <Charts 
              data={chartsData} 
              isLoading={chartsLoading}
            />
            
            {/* Outstanding Tasks */}
            <OutstandingTasks
              data={tasksData}
              isLoading={tasksLoading}
              onTaskClick={handleTaskClick}
              onTaskAction={handleTaskAction}
            />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Content Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Content analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
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
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>User Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">User activity analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerListQuickLinks
              data={customersData}
              isLoading={customersLoading}
              onCustomerClick={handleCustomerClick}
              onManageCustomer={handleManageCustomer}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Manage Users</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Building2 className="h-6 w-6" />
                <span className="text-sm">Organizations</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Filter className="h-6 w-6" />
                <span className="text-sm">Moderation</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;