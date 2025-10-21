import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Video, 
  Eye, 
  Users, 
  Award,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KPIMetrics } from '@/types/admin';

interface KPICardsProps {
  data?: KPIMetrics;
  isLoading?: boolean;
  className?: string;
}

const KPI_CARDS = [
  {
    key: 'clipsPublished' as keyof KPIMetrics,
    title: 'Clips Published',
    icon: Video,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    description: 'Total clips published this month',
  },
  {
    key: 'viewsLast30d' as keyof KPIMetrics,
    title: 'Views (30d)',
    icon: Eye,
    color: 'text-info',
    bgColor: 'bg-info/10',
    description: 'Total views in the last 30 days',
  },
  {
    key: 'activeUsers' as keyof KPIMetrics,
    title: 'Active Users',
    icon: Users,
    color: 'text-success',
    bgColor: 'bg-success/10',
    description: 'Users active in the last 30 days',
  },
  {
    key: 'certificatesIssued' as keyof KPIMetrics,
    title: 'Certificates Issued',
    icon: Award,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    description: 'Certificates issued this month',
  },
];

const KPICardSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 bg-muted rounded w-24"></div>
      <div className="h-8 w-8 bg-muted rounded"></div>
    </CardHeader>
    <CardContent>
      <div className="h-8 bg-muted rounded w-16 mb-2"></div>
      <div className="h-3 bg-muted rounded w-20"></div>
    </CardContent>
  </Card>
);

const KPICard: React.FC<{
  title: string;
  value: number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description: string;
}> = ({ title, value, icon: Icon, color, bgColor, description, change }) => {
  const isPositive = change >= 0;
  const changeAbs = Math.abs(change);
  
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn('p-2 rounded-lg', bgColor)}>
          <Icon className={cn('h-4 w-4', color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
          <div className="flex items-center space-x-1">
            {change !== 0 && (
              <>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-error" />
                )}
                <Badge 
                  variant={isPositive ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {isPositive ? '+' : '-'}{changeAbs}%
                </Badge>
              </>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export const KPICards: React.FC<KPICardsProps> = ({ 
  data, 
  isLoading = false, 
  className 
}) => {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
        {Array.from({ length: 4 }).map((_, index) => (
          <KPICardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
        {KPI_CARDS.map((card) => (
          <Card key={card.key} className="border-dashed">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn('p-2 rounded-lg', card.bgColor)}>
                <card.icon className={cn('h-4 w-4', card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-muted-foreground">--</div>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {KPI_CARDS.map((card) => (
        <KPICard
          key={card.key}
          title={card.title}
          value={data[card.key] as number}
          change={data[`${card.key}Change` as keyof KPIMetrics] as number}
          icon={card.icon}
          color={card.color}
          bgColor={card.bgColor}
          description={card.description}
        />
      ))}
    </div>
  );
};

export default KPICards;