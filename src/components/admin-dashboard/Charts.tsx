import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Upload, 
  Search, 
  Users,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChartData } from '@/types/admin';

interface ChartsProps {
  data?: ChartData[];
  isLoading?: boolean;
  className?: string;
}

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--info))',
  'hsl(var(--success))',
  'hsl(var(--error))',
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const CHART_TYPES = [
  {
    id: 'daily-views',
    title: 'Daily Views',
    icon: TrendingUp,
    description: 'Content views over time',
  },
  {
    id: 'uploads',
    title: 'Uploads',
    icon: Upload,
    description: 'Content uploads by day',
  },
  {
    id: 'search-success',
    title: 'Search Success Rate',
    icon: Search,
    description: 'Search query success rate',
  },
  {
    id: 'customer-usage',
    title: 'Customer Usage',
    icon: Users,
    description: 'Usage by customer organization',
  },
];

const ChartSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 bg-muted rounded w-32 mb-2"></div>
      <div className="h-4 bg-muted rounded w-48"></div>
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-muted rounded"></div>
    </CardContent>
  </Card>
);

const LineChartComponent: React.FC<{ data: any[]; color: string }> = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
      <XAxis 
        dataKey="date" 
        tick={{ fontSize: 12 }}
        tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
        axisLine={{ stroke: 'hsl(var(--border))' }}
      />
      <YAxis 
        tick={{ fontSize: 12 }}
        tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
        axisLine={{ stroke: 'hsl(var(--border))' }}
      />
      <Tooltip 
        contentStyle={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}
        labelStyle={{ color: 'hsl(var(--foreground))' }}
      />
      <Line 
        type="monotone" 
        dataKey="value" 
        stroke={color} 
        strokeWidth={2}
        dot={{ fill: color, strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

const AreaChartComponent: React.FC<{ data: any[]; color: string }> = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
      <XAxis 
        dataKey="date" 
        tick={{ fontSize: 12 }}
        tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
        axisLine={{ stroke: 'hsl(var(--border))' }}
      />
      <YAxis 
        tick={{ fontSize: 12 }}
        tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
        axisLine={{ stroke: 'hsl(var(--border))' }}
      />
      <Tooltip 
        contentStyle={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}
        labelStyle={{ color: 'hsl(var(--foreground))' }}
      />
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke={color} 
        fill={color}
        fillOpacity={0.2}
        strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
);

const BarChartComponent: React.FC<{ data: any[]; color: string }> = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
      <XAxis 
        dataKey="date" 
        tick={{ fontSize: 12 }}
        tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
        axisLine={{ stroke: 'hsl(var(--border))' }}
      />
      <YAxis 
        tick={{ fontSize: 12 }}
        tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
        axisLine={{ stroke: 'hsl(var(--border))' }}
      />
      <Tooltip 
        contentStyle={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}
        labelStyle={{ color: 'hsl(var(--foreground))' }}
      />
      <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

const PieChartComponent: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip 
        contentStyle={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}
        labelStyle={{ color: 'hsl(var(--foreground))' }}
      />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

const ChartCard: React.FC<{
  chart: ChartData;
  index: number;
}> = ({ chart, index }) => {
  const color = CHART_COLORS[index % CHART_COLORS.length];
  
  const renderChart = () => {
    switch (chart.type) {
      case 'line':
        return <LineChartComponent data={chart.data} color={color} />;
      case 'area':
        return <AreaChartComponent data={chart.data} color={color} />;
      case 'bar':
        return <BarChartComponent data={chart.data} color={color} />;
      case 'pie':
        return <PieChartComponent data={chart.data} />;
      default:
        return <LineChartComponent data={chart.data} color={color} />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{chart.title}</CardTitle>
        {chart.description && (
          <p className="text-sm text-muted-foreground">{chart.description}</p>
        )}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export const Charts: React.FC<ChartsProps> = ({ 
  data, 
  isLoading = false, 
  className 
}) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ChartSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CHART_TYPES.map((chartType) => (
            <Card key={chartType.id} className="border-dashed">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <chartType.icon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg font-semibold text-muted-foreground">
                    {chartType.title}
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{chartType.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>No data available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.slice(0, 4).map((chart) => (
              <ChartCard key={chart.id} chart={chart} index={0} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.filter(chart => 
              chart.title.toLowerCase().includes('view') || 
              chart.title.toLowerCase().includes('upload') ||
              chart.title.toLowerCase().includes('content')
            ).map((chart) => (
              <ChartCard key={chart.id} chart={chart} index={0} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.filter(chart => 
              chart.title.toLowerCase().includes('user') || 
              chart.title.toLowerCase().includes('customer') ||
              chart.title.toLowerCase().includes('active')
            ).map((chart) => (
              <ChartCard key={chart.id} chart={chart} index={0} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.filter(chart => 
              chart.title.toLowerCase().includes('search') || 
              chart.title.toLowerCase().includes('success') ||
              chart.title.toLowerCase().includes('system')
            ).map((chart) => (
              <ChartCard key={chart.id} chart={chart} index={0} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Charts;