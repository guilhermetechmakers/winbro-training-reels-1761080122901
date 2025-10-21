import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Lock, Clock, Award, BookOpen, Target, TrendingUp, Users, Star } from 'lucide-react';
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
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          Course Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Overall Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs px-2 py-1">
                {completedModules}/{totalModules} modules
              </Badge>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-primary">
                  {overallProgress}
                </span>
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Progress 
              value={overallProgress} 
              className="h-4 bg-muted/50"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>{completedNodes}/{totalNodes} lessons</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{Math.round(course.estimated_duration * (overallProgress / 100))} min left</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Module Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-sm text-foreground">Module Progress</h4>
            </div>
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
                  className={`space-y-3 p-4 rounded-xl border transition-all duration-300 ${
                    isCurrentModule 
                      ? 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/30 shadow-md' 
                      : 'bg-card hover:bg-muted/50 hover:shadow-sm'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        module.is_completed 
                          ? 'bg-success' 
                          : module.is_locked 
                            ? 'bg-muted' 
                            : isCurrentModule
                              ? 'bg-primary'
                              : 'bg-primary/60'
                      }`} />
                      <div>
                        <span className={`text-sm font-medium ${
                          isCurrentModule ? 'text-primary' : 'text-foreground'
                        }`}>
                          {module.title}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {module.nodes.length} lessons • {module.estimated_duration} min
                        </p>
                      </div>
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
                        className={`text-xs px-2 py-1 ${
                          module.is_completed 
                            ? 'bg-success text-success-foreground' 
                            : module.is_locked 
                              ? 'bg-muted text-muted-foreground' 
                              : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {module.is_completed ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : module.is_locked ? (
                          <Lock className="h-3 w-3 mr-1" />
                        ) : null}
                        {module.is_completed ? 'Complete' : module.is_locked ? 'Locked' : 'In Progress'}
                      </Badge>
                      
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">
                          {progress}
                        </span>
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={progress} 
                      className="h-3 bg-muted/50"
                    />
                    <motion.div
                      className={`absolute inset-0 rounded-full ${
                        module.is_completed 
                          ? 'bg-gradient-to-r from-success to-success/80' 
                          : 'bg-gradient-to-r from-primary/60 to-primary/80'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-success" />
                        {module.nodes.filter(n => n.is_completed).length}/{module.nodes.length} lessons
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {module.estimated_duration} min
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Completion Status */}
        {overallProgress === 100 && (
          <motion.div
            className="p-6 bg-gradient-to-br from-success/10 via-success/5 to-success/10 border border-success/30 rounded-xl shadow-lg"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-success text-lg">Course Completed!</h4>
                <p className="text-sm text-success/80 mt-1">
                  Congratulations! You've successfully completed all modules and lessons.
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-success/70">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span>Certificate earned</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>Join {course.enrollment_count} graduates</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
