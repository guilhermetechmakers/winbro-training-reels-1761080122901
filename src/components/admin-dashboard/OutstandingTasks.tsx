import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  Eye,
  User,
  Calendar,
  Flag,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OutstandingTask } from '@/types/admin';

interface OutstandingTasksProps {
  data?: OutstandingTask[];
  isLoading?: boolean;
  onTaskClick?: (task: OutstandingTask) => void;
  onTaskAction?: (taskId: string, action: string) => void;
  className?: string;
}

const PRIORITY_CONFIG = {
  low: {
    color: 'bg-info/10 text-info border-info/20',
    icon: Clock,
  },
  medium: {
    color: 'bg-secondary/10 text-secondary border-secondary/20',
    icon: AlertCircle,
  },
  high: {
    color: 'bg-error/10 text-error border-error/20',
    icon: AlertTriangle,
  },
  urgent: {
    color: 'bg-error/20 text-error border-error/40',
    icon: Flag,
  },
};

const STATUS_CONFIG = {
  pending: {
    color: 'bg-secondary/10 text-secondary',
    icon: Clock,
  },
  in_progress: {
    color: 'bg-info/10 text-info',
    icon: Eye,
  },
  completed: {
    color: 'bg-success/10 text-success',
    icon: CheckCircle,
  },
};

const TASK_TYPE_CONFIG = {
  review: {
    color: 'bg-primary/10 text-primary',
    icon: Eye,
    label: 'Review',
  },
  flagged: {
    color: 'bg-error/10 text-error',
    icon: Flag,
    label: 'Flagged',
  },
  moderation: {
    color: 'bg-secondary/10 text-secondary',
    icon: MessageSquare,
    label: 'Moderation',
  },
  user_issue: {
    color: 'bg-info/10 text-info',
    icon: User,
    label: 'User Issue',
  },
};

const TaskSkeleton = () => (
  <Card className="animate-pulse bg-gradient-to-br from-card to-card/50">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="flex space-x-2">
            <div className="h-5 bg-muted rounded w-16"></div>
            <div className="h-5 bg-muted rounded w-20"></div>
          </div>
        </div>
        <div className="h-8 w-8 bg-muted rounded"></div>
      </div>
    </CardContent>
  </Card>
);

const TaskCard: React.FC<{
  task: OutstandingTask;
  onTaskClick?: (task: OutstandingTask) => void;
  onTaskAction?: (taskId: string, action: string) => void;
}> = ({ task, onTaskClick, onTaskAction }) => {
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const statusConfig = STATUS_CONFIG[task.status];
  const typeConfig = TASK_TYPE_CONFIG[task.type];
  const PriorityIcon = priorityConfig.icon;
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Card 
      className={cn(
        "hover:shadow-elevation-200 transition-all duration-300 cursor-pointer group",
        "hover:-translate-y-1 hover:border-primary/30",
        isOverdue && "border-error/50 bg-error/5 hover:bg-error/10",
        task.priority === 'urgent' && "border-error/30 bg-error/5 hover:bg-error/10",
        "bg-gradient-to-br from-card to-card/50"
      )}
      onClick={() => onTaskClick?.(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <TypeIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{task.title}</h3>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
              {task.description}
            </p>
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{getTimeAgo(task.createdAt)}</span>
              {task.assignedTo && (
                <>
                  <User className="h-3 w-3 ml-2" />
                  <span>{task.assignedTo}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={cn('text-xs', priorityConfig.color)}
              >
                <PriorityIcon className="h-3 w-3 mr-1" />
                {task.priority}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={cn('text-xs', statusConfig.color)}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {task.status.replace('_', ' ')}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={cn('text-xs', typeConfig.color)}
              >
                <TypeIcon className="h-3 w-3 mr-1" />
                {typeConfig.label}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {isOverdue && (
              <AlertCircle className="h-4 w-4 text-error" />
            )}
            
            {task.status === 'pending' && onTaskAction && (
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs hover:bg-primary/10 hover:border-primary transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskAction(task.id, 'start');
                  }}
                >
                  Start
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs hover:bg-success/10 hover:border-success transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskAction(task.id, 'complete');
                  }}
                >
                  Complete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const OutstandingTasks: React.FC<OutstandingTasksProps> = ({ 
  data, 
  isLoading = false, 
  onTaskClick,
  onTaskAction,
  className 
}) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Outstanding Tasks</h2>
          <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <TaskSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Outstanding Tasks</h2>
          <Badge variant="secondary">0 tasks</Badge>
        </div>
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              All caught up!
            </h3>
            <p className="text-sm text-muted-foreground">
              No outstanding tasks at the moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const urgentTasks = data.filter(task => task.priority === 'urgent');
  const overdueTasks = data.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date()
  );

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <span>Outstanding Tasks</span>
        </h2>
        <div className="flex items-center space-x-2">
          {urgentTasks.length > 0 && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              {urgentTasks.length} urgent
            </Badge>
          )}
          {overdueTasks.length > 0 && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              {overdueTasks.length} overdue
            </Badge>
          )}
          <Badge variant="secondary">{data.length} total</Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((task, index) => (
          <div
            key={task.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <TaskCard
              task={task}
              onTaskClick={onTaskClick}
              onTaskAction={onTaskAction}
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
            View All Tasks
          </Button>
        </div>
      )}
    </div>
  );
};

export default OutstandingTasks;