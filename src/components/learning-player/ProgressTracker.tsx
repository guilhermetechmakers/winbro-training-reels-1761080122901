import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Lock, Clock, Award, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LearningPlayerCourse } from '@/types/content';

interface ProgressTrackerProps {
  course: LearningPlayerCourse;
  currentModuleIndex: number;
  currentNodeIndex: number;
  overallProgress: number;
  moduleProgress: Record<string, number>;
  className?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  course,
  currentModuleIndex,
  overallProgress,
  moduleProgress,
  className = ''
}) => {
  const completedModules = course.modules.filter(module => module.is_completed).length;
  const totalModules = course.modules.length;
  const completedNodes = course.modules.reduce((acc, module) => 
    acc + module.nodes.filter(node => node.is_completed).length, 0
  );
  const totalNodes = course.modules.reduce((acc, module) => acc + module.nodes.length, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5" />
          Course Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {completedModules}/{totalModules} modules
              </Badge>
              <span className="text-sm font-semibold text-primary">
                {overallProgress}%
              </span>
            </div>
          </div>
          
          <div className="relative">
            <Progress 
              value={overallProgress} 
              className="h-3"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedNodes}/{totalNodes} lessons completed</span>
            <span>{Math.round(course.estimated_duration * (overallProgress / 100))} min remaining</span>
          </div>
        </div>

        <Separator />

        {/* Module Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-foreground">Module Progress</h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {course.estimated_duration} min total
            </div>
          </div>
          
          <div className="space-y-3">
            {course.modules.map((module, index) => {
              const isCurrentModule = index === currentModuleIndex;
              const progress = moduleProgress[module.id] || 0;
              
              return (
                <motion.div
                  key={module.id}
                  className={`space-y-2 p-3 rounded-lg border transition-all duration-200 ${
                    isCurrentModule 
                      ? 'bg-primary/5 border-primary/20 shadow-sm' 
                      : 'bg-card hover:bg-muted/50'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        module.is_completed 
                          ? 'bg-success' 
                          : module.is_locked 
                            ? 'bg-muted' 
                            : isCurrentModule
                              ? 'bg-primary'
                              : 'bg-primary/60'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isCurrentModule ? 'text-primary' : 'text-foreground'
                      }`}>
                        {module.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          module.is_completed 
                            ? "default" 
                            : module.is_locked 
                              ? "secondary" 
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {module.is_completed ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : module.is_locked ? (
                          <Lock className="h-3 w-3 mr-1" />
                        ) : null}
                        {module.is_completed ? 'Complete' : module.is_locked ? 'Locked' : 'In Progress'}
                      </Badge>
                      
                      <span className="text-xs font-semibold text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={progress} 
                      className="h-2"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/50 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{module.nodes.filter(n => n.is_completed).length}/{module.nodes.length} lessons</span>
                    <span>{module.estimated_duration} min</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Completion Status */}
        {overallProgress === 100 && (
          <motion.div
            className="p-4 bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-success">Course Completed!</h4>
                <p className="text-sm text-success/80">
                  Congratulations! You've completed all modules and lessons.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
