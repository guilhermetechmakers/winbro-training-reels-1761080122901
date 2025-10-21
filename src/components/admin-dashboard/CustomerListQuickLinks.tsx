import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  Video, 
  BookOpen, 
  MoreHorizontal,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CustomerSummary } from '@/types/admin';

interface CustomerListQuickLinksProps {
  data?: CustomerSummary[];
  isLoading?: boolean;
  onCustomerClick?: (customer: CustomerSummary) => void;
  onManageCustomer?: (customer: CustomerSummary) => void;
  className?: string;
}

const STATUS_CONFIG = {
  active: {
    color: 'bg-success/10 text-success border-success/20',
    icon: CheckCircle,
  },
  inactive: {
    color: 'bg-muted/10 text-muted-foreground border-muted/20',
    icon: Clock,
  },
  suspended: {
    color: 'bg-error/10 text-error border-error/20',
    icon: XCircle,
  },
  trial: {
    color: 'bg-info/10 text-info border-info/20',
    icon: Clock,
  },
};

const TIER_CONFIG = {
  basic: {
    color: 'bg-muted/10 text-muted-foreground',
    label: 'Basic',
  },
  professional: {
    color: 'bg-primary/10 text-primary',
    label: 'Professional',
  },
  enterprise: {
    color: 'bg-secondary/10 text-secondary',
    label: 'Enterprise',
  },
};

const CustomerSkeleton = () => (
  <Card className="animate-pulse bg-gradient-to-br from-card to-card/50">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-muted rounded-lg"></div>
          <div className="space-y-1">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        </div>
        <div className="h-8 w-8 bg-muted rounded"></div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-4">
        <div className="h-8 bg-muted rounded"></div>
        <div className="h-8 bg-muted rounded"></div>
        <div className="h-8 bg-muted rounded"></div>
      </div>
    </CardContent>
  </Card>
);

const CustomerCard: React.FC<{
  customer: CustomerSummary;
  onCustomerClick?: (customer: CustomerSummary) => void;
  onManageCustomer?: (customer: CustomerSummary) => void;
}> = ({ customer, onCustomerClick, onManageCustomer }) => {
  const statusConfig = STATUS_CONFIG[customer.status];
  const tierConfig = TIER_CONFIG[customer.subscriptionTier];
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const getUsagePercentage = () => {
    // Assuming a reasonable monthly limit based on tier
    const limits = {
      basic: 1000, // 1000 minutes
      professional: 5000, // 5000 minutes
      enterprise: 50000, // 50000 minutes
    };
    const limit = limits[customer.subscriptionTier] || 1000;
    return Math.min((customer.monthlyUsage / limit) * 100, 100);
  };

  const usagePercentage = getUsagePercentage();
  const isHighUsage = usagePercentage > 80;

  return (
    <Card 
      className={cn(
        "hover:shadow-elevation-200 transition-all duration-300 cursor-pointer group",
        "hover:-translate-y-1 hover:border-primary/30",
        customer.status === 'suspended' && "border-error/50 bg-error/5 hover:bg-error/10",
        isHighUsage && "border-secondary/50 bg-secondary/5 hover:bg-secondary/10",
        "bg-gradient-to-br from-card to-card/50"
      )}
      onClick={() => onCustomerClick?.(customer)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              tierConfig.color
            )}>
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{customer.name}</h3>
              <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                {customer.organizationId}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={cn('text-xs', statusConfig.color)}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {customer.status}
            </Badge>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onManageCustomer?.(customer);
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-1">
              <Users className="h-3 w-3" />
              <span>Users</span>
            </div>
            <div className="text-lg font-semibold">{customer.userCount}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-1">
              <Video className="h-3 w-3" />
              <span>Clips</span>
            </div>
            <div className="text-lg font-semibold">{customer.clipCount}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-1">
              <BookOpen className="h-3 w-3" />
              <span>Courses</span>
            </div>
            <div className="text-lg font-semibold">{customer.courseCount}</div>
          </div>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Monthly Usage</span>
            <span className="font-medium">
              {customer.monthlyUsage.toLocaleString()} min
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                isHighUsage ? "bg-error" : "bg-primary"
              )}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Storage: {customer.storageUsed.toFixed(1)} GB</span>
            <span>Last activity: {getTimeAgo(customer.lastActivity)}</span>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn('text-xs', tierConfig.color)}
          >
            {tierConfig.label}
          </Badge>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs hover:bg-primary/10 hover:text-primary transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onManageCustomer?.(customer);
            }}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const CustomerListQuickLinks: React.FC<CustomerListQuickLinksProps> = ({ 
  data, 
  isLoading = false, 
  onCustomerClick,
  onManageCustomer,
  className 
}) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Customer Organizations</h2>
          <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <CustomerSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Customer Organizations</h2>
          <Badge variant="secondary">0 customers</Badge>
        </div>
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No customers yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Customer organizations will appear here once they sign up.
            </p>
            <Button variant="outline" size="sm">
              Invite Customers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const suspendedCustomers = data.filter(customer => customer.status === 'suspended');
  const highUsageCustomers = data.filter(customer => {
    const limits = { basic: 1000, professional: 5000, enterprise: 50000 };
    const limit = limits[customer.subscriptionTier] || 1000;
    return (customer.monthlyUsage / limit) > 0.8;
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-primary" />
          <span>Customer Organizations</span>
        </h2>
        <div className="flex items-center space-x-2">
          {suspendedCustomers.length > 0 && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              {suspendedCustomers.length} suspended
            </Badge>
          )}
          {highUsageCustomers.length > 0 && (
            <Badge variant="secondary" className="text-xs animate-pulse">
              {highUsageCustomers.length} high usage
            </Badge>
          )}
          <Badge variant="secondary">{data.length} total</Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((customer, index) => (
          <div
            key={customer.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CustomerCard
              customer={customer}
              onCustomerClick={onCustomerClick}
              onManageCustomer={onManageCustomer}
            />
          </div>
        ))}
      </div>
      
      {data.length > 5 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            size="sm"
            className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
          >
            View All Customers
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerListQuickLinks;