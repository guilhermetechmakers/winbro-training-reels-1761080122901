import React, { useState } from 'react';
import { Save, Eye, FileText, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { Course } from '@/types/content';

// Import course builder components
import CourseCanvas from '@/components/course-builder/CourseCanvas';
import ClipPicker from '@/components/course-builder/ClipPicker';
import QuizEditor from '@/components/course-builder/QuizEditor';
import SettingsPanel from '@/components/course-builder/SettingsPanel';
import VersioningPublishControls from '@/components/course-builder/VersioningPublishControls';
import PreviewMode from '@/components/course-builder/PreviewMode';

// Import hooks
import { useCourses } from '@/hooks/useCourses';

const CourseBuilderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('canvas');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [courseData, setCourseData] = useState<Course>({
    id: '',
    title: 'New Course',
    description: '',
    status: 'draft',
    author_id: 'user-1',
    author: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar_url: '/api/placeholder/40/40',
      role: 'trainer',
      organization_id: 'org-1',
      is_verified: true,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    customer_assignments: ['org-1'],
    modules: [],
    settings: {
      passing_threshold: 80,
      max_attempts: 3,
      is_self_paced: true,
      visibility: 'private' as 'public' | 'private' | 'organization',
      prerequisites: []
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    enrollment_count: 0,
    completion_rate: 0
  });

  const { createCourse, updateCourse, isLoading } = useCourses();

  const handleSave = async () => {
    try {
      if (courseData.id) {
        await updateCourse.mutateAsync(courseData);
        toast.success('Course updated successfully');
      } else {
        const newCourse = await createCourse.mutateAsync(courseData);
        setCourseData(prev => ({ ...prev, id: newCourse.id }));
        toast.success('Course created successfully');
      }
    } catch (error) {
      toast.error('Failed to save course');
    }
  };

  const handlePreview = () => {
    setIsPreviewMode(true);
  };

  const handleExitPreview = () => {
    setIsPreviewMode(false);
  };

  if (isPreviewMode) {
    return (
      <PreviewMode 
        courseData={courseData}
        onExit={handleExitPreview}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Course Builder</h1>
                <p className="text-sm text-muted-foreground">
                  Create and manage training courses with clips and quizzes
                </p>
              </div>
              <Badge variant={courseData.status === 'draft' ? 'secondary' : 'default'}>
                {courseData.status}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!courseData.modules.length}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Course Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Course Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <input
                    type="text"
                    value={courseData.title}
                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter course title"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Enter course description"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {courseData.modules.length} modules
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    ~{courseData.modules.length * 5} minutes
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="canvas">Canvas</TabsTrigger>
                <TabsTrigger value="clips">Clips</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="publish">Publish</TabsTrigger>
              </TabsList>

              <TabsContent value="canvas" className="mt-6">
                <CourseCanvas
                  courseData={courseData}
                  onUpdate={setCourseData}
                />
              </TabsContent>

              <TabsContent value="clips" className="mt-6">
                <ClipPicker
                  onClipsSelect={(clips) => {
                    // Handle clip selection
                    console.log('Selected clips:', clips);
                  }}
                />
              </TabsContent>

              <TabsContent value="quizzes" className="mt-6">
                <QuizEditor
                  onQuizCreate={(quiz) => {
                    // Handle quiz creation
                    console.log('Created quiz:', quiz);
                  }}
                />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <SettingsPanel
                  settings={courseData.settings}
                  onSettingsChange={(settings) => {
                    setCourseData(prev => ({ ...prev, settings }));
                  }}
                />
              </TabsContent>

              <TabsContent value="publish" className="mt-6">
                <VersioningPublishControls
                  courseData={courseData}
                  onPublish={(status) => {
                    setCourseData(prev => ({ ...prev, status }));
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilderPage;