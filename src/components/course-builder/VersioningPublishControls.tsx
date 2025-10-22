import React, { useState } from 'react';
import { 
  Save, 
  Send, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Users,
  Settings,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Course, ContentStatus } from '@/types/content';
import { toast } from 'sonner';

interface VersioningPublishControlsProps {
  courseData: Course;
  onPublish: (status: ContentStatus) => void;
}

const VersioningPublishControls: React.FC<VersioningPublishControlsProps> = ({ 
  courseData, 
  onPublish 
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [publishNotes, setPublishNotes] = useState('');

  const handleSaveDraft = () => {
    onPublish('draft');
    toast.success('Course saved as draft');
  };

  const handleSubmitForReview = () => {
    onPublish('review');
    toast.success('Course submitted for review');
  };

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate publishing process
    setTimeout(() => {
      onPublish('published');
      setIsPublishing(false);
      toast.success('Course published successfully');
    }, 2000);
  };

  const handleSchedulePublish = () => {
    if (!scheduledDate) {
      toast.error('Please select a date and time');
      return;
    }
    
    onPublish('published');
    toast.success(`Course scheduled for ${new Date(scheduledDate).toLocaleString()}`);
  };

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ContentStatus) => {
    switch (status) {
      case 'draft': return FileText;
      case 'review': return Clock;
      case 'published': return CheckCircle;
      case 'archived': return History;
      case 'rejected': return AlertCircle;
      default: return FileText;
    }
  };

  const canPublish = courseData.modules.length > 0 && courseData.title.trim() !== '';
  const hasContent = courseData.modules.some(module => module.nodes.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Publish & Versioning</h2>
        <p className="text-sm text-muted-foreground">
          Manage course publication and version control
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {(() => {
                const Icon = getStatusIcon(courseData.status);
                return <Icon className="h-5 w-5 text-muted-foreground" />;
              })()}
              <div>
                <div className="font-medium">Status</div>
                <div className="text-sm text-muted-foreground">
                  {courseData.status.charAt(0).toUpperCase() + courseData.status.slice(1)}
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(courseData.status)}>
              {courseData.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Course Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Course Validation
          </CardTitle>
          <CardDescription>
            Check if your course is ready for publication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {courseData.title.trim() !== '' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Course title is set</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {courseData.modules.length > 0 ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">At least one module exists</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {hasContent ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Modules contain content</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {courseData.settings.passing_threshold > 0 ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Passing threshold is configured</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publish Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="h-5 w-5 mr-2" />
            Publish Actions
          </CardTitle>
          <CardDescription>
            Choose how to publish your course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="publish" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="publish">Publish Now</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            <TabsContent value="publish" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Publish Immediately</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Make your course available to learners right away
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handlePublish}
                    disabled={!canPublish || isPublishing}
                    className="flex-1"
                  >
                    {isPublishing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Publish Now
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Schedule Publication</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set a specific date and time to publish your course
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schedule-date">Publication Date & Time</Label>
                    <Input
                      id="schedule-date"
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="publish-notes">Notes (Optional)</Label>
                    <Textarea
                      id="publish-notes"
                      value={publishNotes}
                      onChange={(e) => setPublishNotes(e.target.value)}
                      placeholder="Add any notes about this publication..."
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleSchedulePublish}
                    disabled={!canPublish || !scheduledDate}
                    className="w-full"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Publication
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Submit for Review</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send your course to administrators for review before publication
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Review Process</div>
                      <div className="text-sm text-blue-700 mt-1">
                        Your course will be reviewed by administrators before being published. 
                        You'll receive a notification once the review is complete.
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmitForReview}
                  disabled={!canPublish}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Review
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Course Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Course Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{courseData.modules.length}</div>
              <div className="text-xs text-muted-foreground">Modules</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {courseData.modules.reduce((acc, module) => acc + module.nodes.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Content Items</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {courseData.modules.reduce((acc, module) => acc + module.estimated_duration, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {courseData.enrollment_count || 0}
              </div>
              <div className="text-xs text-muted-foreground">Enrollments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div>
                  <div className="font-medium text-sm">Current Version</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(courseData.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <Badge variant="outline">v1.0</Badge>
            </div>
            
            <div className="text-center py-4 text-sm text-muted-foreground">
              No previous versions available
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VersioningPublishControls;
