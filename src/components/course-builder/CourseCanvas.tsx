import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  GripVertical, 
  Play, 
  FileText, 
  Trash2, 
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Course, CourseModule, CourseNode } from '@/types/content';

interface CourseCanvasProps {
  courseData: Course;
  onUpdate: (courseData: Course) => void;
}

const CourseCanvas: React.FC<CourseCanvasProps> = ({ courseData, onUpdate }) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverModule, setDragOverModule] = useState<string | null>(null);

  const handleAddModule = () => {
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      title: 'New Module',
      description: '',
      order: courseData.modules.length,
      nodes: [],
      is_required: true,
      estimated_duration: 0
    };

    onUpdate({
      ...courseData,
      modules: [...courseData.modules, newModule]
    });
  };

  const handleAddNode = (moduleId: string, type: 'clip' | 'quiz') => {
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module) return;

    const newNode: CourseNode = {
      id: `${type}-${Date.now()}`,
      type,
      order: module.nodes.length,
      is_required: true,
      estimated_duration: type === 'clip' ? 2 : 5
    };

    const updatedModules = courseData.modules.map(m => 
      m.id === moduleId 
        ? { ...m, nodes: [...m.nodes, newNode] }
        : m
    );

    onUpdate({
      ...courseData,
      modules: updatedModules
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    const updatedModules = courseData.modules.filter(m => m.id !== moduleId);
    onUpdate({
      ...courseData,
      modules: updatedModules
    });
  };

  const handleDeleteNode = (moduleId: string, nodeId: string) => {
    const updatedModules = courseData.modules.map(m => 
      m.id === moduleId 
        ? { ...m, nodes: m.nodes.filter(n => n.id !== nodeId) }
        : m
    );

    onUpdate({
      ...courseData,
      modules: updatedModules
    });
  };

  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    setDraggedItem(nodeId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, moduleId: string) => {
    e.preventDefault();
    setDragOverModule(moduleId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverModule(null);
  };

  const handleDrop = (e: React.DragEvent, targetModuleId: string) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    // Find the source module and node
    let sourceModuleId = '';
    let sourceNode: CourseNode | null = null;

    for (const module of courseData.modules) {
      const node = module.nodes.find(n => n.id === draggedItem);
      if (node) {
        sourceModuleId = module.id;
        sourceNode = node;
        break;
      }
    }

    if (!sourceNode || sourceModuleId === targetModuleId) return;

    // Remove from source module
    const updatedModules = courseData.modules.map(m => 
      m.id === sourceModuleId 
        ? { ...m, nodes: m.nodes.filter(n => n.id !== draggedItem) }
        : m
    );

    // Add to target module
    const finalModules = updatedModules.map(m => 
      m.id === targetModuleId 
        ? { ...m, nodes: [...m.nodes, { ...sourceNode, order: m.nodes.length }] }
        : m
    );

    onUpdate({
      ...courseData,
      modules: finalModules
    });

    setDraggedItem(null);
    setDragOverModule(null);
  };

  const getNodeIcon = (type: 'clip' | 'quiz') => {
    return type === 'clip' ? Play : FileText;
  };

  const getNodeColor = (type: 'clip' | 'quiz') => {
    return type === 'clip' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Course Structure</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop to organize your course modules and content
          </p>
        </div>
        <Button onClick={handleAddModule} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Course Modules */}
      <div className="space-y-4">
        <AnimatePresence>
          {courseData.modules.map((module) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className={`transition-all duration-200 ${
                  dragOverModule === module.id ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, module.id)}
                onDrop={(e) => handleDrop(e, module.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>
                          {module.nodes.length} items • ~{module.estimated_duration} minutes
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={module.is_required ? 'default' : 'secondary'}>
                        {module.is_required ? 'Required' : 'Optional'}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleAddNode(module.id, 'clip')}>
                            <Play className="h-4 w-4 mr-2" />
                            Add Clip
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddNode(module.id, 'quiz')}>
                            <FileText className="h-4 w-4 mr-2" />
                            Add Quiz
                          </DropdownMenuItem>
                          <Separator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteModule(module.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Module
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Module Nodes */}
                  <div className="space-y-2">
                    {module.nodes.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No content yet</p>
                        <p className="text-xs">Add clips or quizzes to get started</p>
                      </div>
                    ) : (
                      module.nodes.map((node) => {
                        const Icon = getNodeIcon(node.type);
                        return (
                          <div
                            key={node.id}
                            draggable
                            onDragStart={(e: React.DragEvent) => handleDragStart(e, node.id)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-move transition-colors ${
                              draggedItem === node.id ? 'opacity-50' : ''
                            }`}
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            
                            <div className={`p-2 rounded-md ${getNodeColor(node.type)}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">
                                  {node.type === 'clip' ? 'Video Clip' : 'Quiz'}
                                </span>
                                {node.is_required && (
                                  <Badge variant="outline" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                ~{node.estimated_duration} minutes
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNode(module.id, node.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add Content Buttons */}
                  <div className="flex space-x-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddNode(module.id, 'clip')}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Add Clip
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddNode(module.id, 'quiz')}
                      className="flex-1"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Add Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {courseData.modules.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No modules yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first module to start building your course
            </p>
            <Button onClick={handleAddModule}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Module
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseCanvas;
