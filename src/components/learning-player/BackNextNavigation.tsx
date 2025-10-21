import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Lock, 
  CheckCircle, 
  Play,
  RotateCcw,
  Clock,
  Target,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
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
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Previous Button */}
          <motion.div 
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant={previousButtonState.variant}
              onClick={onPrevious}
              disabled={previousButtonState.disabled}
              className="flex items-center gap-2 min-w-32"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4" />
              {previousButtonState.text}
            </Button>

            {previousNode && (
              <div className="text-sm text-muted-foreground max-w-48">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    previousNode.is_completed ? 'bg-success' : 'bg-muted'
                  }`} />
                  <span className="font-medium truncate">{previousNode.title}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {previousNode.estimated_duration} min
                </div>
              </div>
            )}
          </motion.div>

          {/* Center Info */}
          <div className="flex flex-col items-center gap-3 order-first lg:order-none">
            {/* Current Lesson Status */}
            {currentNode && (
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Badge 
                  variant={
                    currentNode.is_completed 
                      ? "default" 
                      : currentNode.is_locked 
                        ? "secondary" 
                        : "outline"
                  }
                  className={`flex items-center gap-2 px-3 py-1 ${
                    currentNode.is_completed 
                      ? 'bg-success text-success-foreground' 
                      : currentNode.is_locked 
                        ? 'bg-muted text-muted-foreground' 
                        : 'bg-primary/10 text-primary'
                  }`}
                >
                  {currentNode.is_completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : currentNode.is_locked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {currentNode.is_completed ? 'Completed' : currentNode.is_locked ? 'Locked' : 'In Progress'}
                </Badge>
                
                {currentNode.is_required && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    <Target className="h-3 w-3 mr-1" />
                    Required
                  </Badge>
                )}
              </motion.div>
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
                      className="flex items-center gap-2 hover:bg-muted/50"
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
          <motion.div 
            className="flex flex-col sm:flex-row items-end sm:items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {nextNodeInfo && (
              <div className="text-sm text-muted-foreground text-right max-w-48">
                <div className="flex items-center gap-2 justify-end">
                  <span className="font-medium truncate">{nextNodeInfo.title}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    nextNodeInfo.isCompleted ? 'bg-success' : 
                    nextNodeInfo.isLocked ? 'bg-muted' : 'bg-primary'
                  }`} />
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs justify-end">
                  <Clock className="h-3 w-3" />
                  {nextNodeInfo.duration} min
                  {nextNodeInfo.isRequired && (
                    <Badge variant="outline" className="ml-2 text-xs px-1 py-0">
                      <Target className="h-2 w-2 mr-1" />
                      Required
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={nextButtonState.variant}
                    onClick={onNext}
                    disabled={nextButtonState.disabled}
                    className={`flex items-center gap-2 min-w-32 ${
                      nextButtonState.disabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:shadow-md transition-shadow'
                    }`}
                    size="lg"
                  >
                    {nextButtonState.text}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getLockReason()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackNextNavigation;
