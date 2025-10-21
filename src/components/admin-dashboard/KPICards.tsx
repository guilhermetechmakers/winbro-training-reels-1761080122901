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
    borderColor: 'border-primary/20',
    description: 'Total clips published this month',
  },
  {
    key: 'viewsLast30d' as keyof KPIMetrics,
    title: 'Views (30d)',
    icon: Eye,
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/20',
    description: 'Total views in the last 30 days',
  },
  {
    key: 'activeUsers' as keyof KPIMetrics,
    title: 'Active Users',
    icon: Users,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/20',
    description: 'Users active in the last 30 days',
  },
  {
    key: 'certificatesIssued' as keyof KPIMetrics,
    title: 'Certificates Issued',
    icon: Award,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/20',
    description: 'Certificates issued this month',
  },
];

const KPICardSkeleton = () => (
  <Card className="animate-pulse bg-gradient-to-br from-card to-card/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 bg-muted rounded w-24"></div>
      <div className="h-10 w-10 bg-muted rounded-xl"></div>
    </CardHeader>
    <CardContent>
      <div className="h-8 bg-muted rounded w-20 mb-2"></div>
      <div className="h-3 bg-muted rounded w-32"></div>
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
  borderColor: string;
  description: string;
}> = ({ title, value, icon: Icon, color, bgColor, borderColor, description, change }) => {
  const isPositive = change >= 0;
  const changeAbs = Math.abs(change);
  
  return (
    <Card className={cn(
      "hover:shadow-elevation-200 transition-all duration-300 hover:-translate-y-1 group",
      "border-l-4 border-l-transparent hover:border-l-primary/30",
      "bg-gradient-to-br from-card to-card/50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className={cn(
          'p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg',
          bgColor,
          borderColor
        )}>
          <Icon className={cn('h-5 w-5', color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
            {value.toLocaleString()}
          </div>
          <div className="flex items-center space-x-1">
            {change !== 0 && (
              <>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success animate-pulse" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-error animate-pulse" />
                )}
                <Badge 
                  variant={isPositive ? 'default' : 'destructive'}
                  className={cn(
                    "text-xs font-semibold transition-all duration-300",
                    isPositive ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"
                  )}
                >
                  {isPositive ? '+' : '-'}{changeAbs}%
                </Badge>
              </>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 group-hover:text-foreground/80 transition-colors">
          {description}
        </p>
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
          <Card key={card.key} className="border-dashed border-2 border-muted/50 bg-muted/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn('p-3 rounded-xl', card.bgColor, card.borderColor)}>
                <card.icon className={cn('h-5 w-5', card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold text-muted-foreground">--</div>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {KPI_CARDS.map((card, index) => (
        <div
          key={card.key}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <KPICard
            title={card.title}
            value={data[card.key] as number}
            change={data[`${card.key}Change` as keyof KPIMetrics] as number}
            icon={card.icon}
            color={card.color}
            bgColor={card.bgColor}
            borderColor={card.borderColor}
            description={card.description}
          />
        </div>
      ))}
    </div>
  );
};

export default KPICards;