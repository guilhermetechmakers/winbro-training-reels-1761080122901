import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  CheckCircle, 
  Play,
  RotateCcw
} from 'lucide-react';
import type { LearningPlayerNode } from '@/types/content';

interface BackNextNavigationProps {
  currentModuleIndex: number;
  currentNodeIndex: number;
  currentNode: LearningPlayerNode | undefined;
  nextNode: LearningPlayerNode | undefined;
  previousNode: LearningPlayerNode | undefined;
  onPrevious: () => void;
  onNext: () => void;
  onRetry?: () => void;
  isRetryAvailable?: boolean;
  className?: string;
}

const BackNextNavigation: React.FC<BackNextNavigationProps> = ({
  currentModuleIndex,
  currentNodeIndex,
  currentNode,
  nextNode,
  previousNode,
  onPrevious,
  onNext,
  onRetry,
  isRetryAvailable = false,
  className = ''
}) => {
  const canGoPrevious = currentModuleIndex > 0 || currentNodeIndex > 0;
  
  const isNextLocked = nextNode?.is_locked || false;
  const isCurrentCompleted = currentNode?.is_completed || false;
  const isCurrentRequired = currentNode?.is_required || false;

  const getNextButtonState = () => {
    if (!nextNode) return { disabled: true, text: 'Course Complete', variant: 'default' as const };
    if (isNextLocked) return { disabled: true, text: 'Locked', variant: 'secondary' as const };
    if (!isCurrentCompleted && isCurrentRequired) return { disabled: true, text: 'Complete Current', variant: 'outline' as const };
    return { disabled: false, text: 'Next', variant: 'default' as const };
  };

  const getPreviousButtonState = () => {
    if (!canGoPrevious) return { disabled: true, text: 'Previous', variant: 'outline' as const };
    return { disabled: false, text: 'Previous', variant: 'outline' as const };
  };

  const nextButtonState = getNextButtonState();
  const previousButtonState = getPreviousButtonState();

  const getLockReason = () => {
    if (!nextNode) return 'This is the last lesson in the course.';
    if (isNextLocked) {
      if (nextNode.is_required && !isCurrentCompleted) {
        return 'Complete the current lesson to unlock the next one.';
      }
      return 'This lesson is locked. Complete previous lessons to unlock it.';
    }
    if (!isCurrentCompleted && isCurrentRequired) {
      return 'Complete the current lesson before proceeding.';
    }
    return '';
  };

  const getNextNodeInfo = () => {
    if (!nextNode) return null;
    
    return {
      title: nextNode.title,
      type: nextNode.type,
      duration: nextNode.estimated_duration,
      isRequired: nextNode.is_required,
      isCompleted: nextNode.is_completed,
      isLocked: nextNode.is_locked
    };
  };

  const nextNodeInfo = getNextNodeInfo();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Previous Button */}
      <div className="flex items-center gap-2">
        <Button
          variant={previousButtonState.variant}
          onClick={onPrevious}
          disabled={previousButtonState.disabled}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {previousButtonState.text}
        </Button>

        {previousNode && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{previousNode.title}</span>
            <span className="ml-2 text-xs">
              ({previousNode.estimated_duration} min)
            </span>
          </div>
        )}
      </div>

      {/* Center Info */}
      <div className="flex items-center gap-4">
        {/* Current Lesson Status */}
        {currentNode && (
          <div className="flex items-center gap-2">
            <Badge 
              variant={
                currentNode.is_completed 
                  ? "default" 
                  : currentNode.is_locked 
                    ? "secondary" 
                    : "outline"
              }
              className="flex items-center gap-1"
            >
              {currentNode.is_completed ? (
                <CheckCircle className="h-3 w-3" />
              ) : currentNode.is_locked ? (
                <Lock className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
              {currentNode.is_completed ? 'Completed' : currentNode.is_locked ? 'Locked' : 'In Progress'}
            </Badge>
            
            {currentNode.is_required && (
              <Badge variant="outline" className="text-xs">
                Required
              </Badge>
            )}
          </div>
        )}

        {/* Retry Button */}
        {isRetryAvailable && onRetry && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRetry}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retry
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Retry this lesson</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Next Button */}
      <div className="flex items-center gap-2">
        {nextNodeInfo && (
          <div className="text-sm text-muted-foreground text-right">
            <span className="font-medium">{nextNodeInfo.title}</span>
            <span className="ml-2 text-xs">
              ({nextNodeInfo.duration} min)
            </span>
            {nextNodeInfo.isRequired && (
              <Badge variant="outline" className="ml-2 text-xs">
                Required
              </Badge>
            )}
          </div>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={nextButtonState.variant}
                onClick={onNext}
                disabled={nextButtonState.disabled}
                className="flex items-center gap-2"
              >
                {nextButtonState.text}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getLockReason()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default BackNextNavigation;
