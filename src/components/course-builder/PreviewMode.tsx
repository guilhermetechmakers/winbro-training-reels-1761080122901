import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  CheckCircle,
  Clock,
  FileText,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Course } from '@/types/content';

interface PreviewModeProps {
  courseData: Course;
  onExit: () => void;
}

const PreviewMode: React.FC<PreviewModeProps> = ({ courseData, onExit }) => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentModule = courseData.modules[currentModuleIndex];
  const currentNode = currentModule?.nodes[currentNodeIndex];

  const handleNext = () => {
    if (currentNodeIndex < currentModule.nodes.length - 1) {
      setCurrentNodeIndex(prev => prev + 1);
    } else if (currentModuleIndex < courseData.modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
      setCurrentNodeIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentNodeIndex > 0) {
      setCurrentNodeIndex(prev => prev - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(prev => prev - 1);
      setCurrentNodeIndex(courseData.modules[currentModuleIndex - 1].nodes.length - 1);
    }
  };

  const handleModuleClick = (moduleIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentNodeIndex(0);
  };

  const handleNodeClick = (nodeIndex: number) => {
    setCurrentNodeIndex(nodeIndex);
  };

  const getNodeIcon = (type: 'clip' | 'quiz') => {
    return type === 'clip' ? Play : FileText;
  };

  const getNodeStatus = (moduleIndex: number, nodeIndex: number) => {
    if (moduleIndex < currentModuleIndex) return 'completed';
    if (moduleIndex === currentModuleIndex && nodeIndex < currentNodeIndex) return 'completed';
    if (moduleIndex === currentModuleIndex && nodeIndex === currentNodeIndex) return 'current';
    return 'locked';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'current': return 'text-blue-600';
      case 'locked': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'current': return Play;
      case 'locked': return Clock;
      default: return Clock;
    }
  };

  const totalDuration = courseData.modules.reduce((acc, module) => 
    acc + module.estimated_duration, 0
  );

  const completedDuration = courseData.modules.slice(0, currentModuleIndex).reduce((acc, module) => 
    acc + module.estimated_duration, 0
  ) + (currentModule?.estimated_duration || 0) * (currentNodeIndex / (currentModule?.nodes.length || 1));

  const overallProgress = totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Course Preview</h1>
              <p className="text-sm text-muted-foreground">{courseData.title}</p>
            </div>
            <Badge variant="outline">Preview Mode</Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onExit}>
              <X className="h-4 w-4 mr-2" />
              Exit Preview
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Course Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Course Structure */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Course Structure</h3>
            <div className="space-y-2">
              {courseData.modules.map((module, moduleIndex) => (
                <div key={module.id} className="space-y-1">
                  <div
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      moduleIndex === currentModuleIndex 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleModuleClick(moduleIndex)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-medium text-sm">{module.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-4">
                      {module.nodes.length} items • {module.estimated_duration} min
                    </div>
                  </div>
                  
                  {moduleIndex === currentModuleIndex && (
                    <div className="ml-4 space-y-1">
                      {module.nodes.map((node, nodeIndex) => {
                        const status = getNodeStatus(moduleIndex, nodeIndex);
                        const Icon = getNodeIcon(node.type);
                        const StatusIcon = getStatusIcon(status);
                        
                        return (
                          <div
                            key={node.id}
                            className={`p-2 rounded cursor-pointer transition-colors ${
                              nodeIndex === currentNodeIndex 
                                ? 'bg-primary/5 border border-primary/20' 
                                : 'hover:bg-muted/30'
                            }`}
                            onClick={() => handleNodeClick(nodeIndex)}
                          >
                            <div className="flex items-center space-x-2">
                              <Icon className={`h-4 w-4 ${getStatusColor(status)}`} />
                              <span className="text-sm">
                                {node.type === 'clip' ? 'Video Clip' : 'Quiz'}
                              </span>
                              <StatusIcon className={`h-3 w-3 ${getStatusColor(status)}`} />
                            </div>
                            <div className="text-xs text-muted-foreground ml-6">
                              {node.estimated_duration} min
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Player */}
          <div className="flex-1 bg-muted/20 flex items-center justify-center">
            {currentNode ? (
              <Card className="w-full max-w-4xl mx-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {(() => {
                          const Icon = getNodeIcon(currentNode.type);
                          return <Icon className="h-5 w-5 mr-2" />;
                        })()}
                        {currentNode.type === 'clip' ? 'Video Clip' : 'Quiz'}
                      </CardTitle>
                      <CardDescription>
                        Module {currentModuleIndex + 1} • Item {currentNodeIndex + 1}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {currentNode.estimated_duration} min
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {currentNode.type === 'clip' ? (
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Video Player Preview</p>
                        <p className="text-sm opacity-75">
                          This would show the actual video content
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium">Quiz Preview</p>
                        <p className="text-muted-foreground">
                          This would show the quiz questions and answers
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Content</h3>
                <p className="text-muted-foreground">
                  This module doesn't have any content yet
                </p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="border-t bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentModuleIndex === 0 && currentNodeIndex === 0}
                >
                  <SkipBack className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={
                    currentModuleIndex === courseData.modules.length - 1 && 
                    currentNodeIndex === currentModule.nodes.length - 1
                  }
                >
                  Next
                  <SkipForward className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.round(completedDuration)} / {totalDuration} min</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{courseData.enrollment_count || 0} enrolled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewMode;
