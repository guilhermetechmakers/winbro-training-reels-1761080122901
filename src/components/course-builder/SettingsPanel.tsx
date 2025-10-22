import React from 'react';
import { 
  Settings, 
  Users, 
  Award, 
  Eye, 
  Lock,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { CourseSettings } from '@/types/content';

interface SettingsPanelProps {
  settings: CourseSettings;
  onSettingsChange: (settings: CourseSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const handleChange = (field: keyof CourseSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Course Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure course requirements, certificates, and visibility
        </p>
      </div>

      {/* Passing Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Passing Requirements
          </CardTitle>
          <CardDescription>
            Set the criteria for course completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passing-threshold">Passing Threshold (%)</Label>
              <Input
                id="passing-threshold"
                type="number"
                value={settings.passing_threshold}
                onChange={(e) => handleChange('passing_threshold', parseInt(e.target.value) || 0)}
                min="0"
                max="100"
                placeholder="80"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum score required to pass the course
              </p>
            </div>

            <div>
              <Label htmlFor="max-attempts">Max Attempts</Label>
              <Input
                id="max-attempts"
                type="number"
                value={settings.max_attempts}
                onChange={(e) => handleChange('max_attempts', parseInt(e.target.value) || 1)}
                min="1"
                placeholder="3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum number of attempts allowed
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="self-paced"
              checked={settings.is_self_paced}
              onCheckedChange={(checked) => handleChange('is_self_paced', checked)}
            />
            <Label htmlFor="self-paced">Self-paced course</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Allow learners to complete the course at their own pace
          </p>
        </CardContent>
      </Card>

      {/* Certificate Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Certificate Settings
          </CardTitle>
          <CardDescription>
            Configure certificate generation and templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="certificate-template">Certificate Template</Label>
            <Select
              value={settings.certificate_template_id || ''}
              onValueChange={(value) => handleChange('certificate_template_id', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No certificate</SelectItem>
                <SelectItem value="template-1">Standard Template</SelectItem>
                <SelectItem value="template-2">Professional Template</SelectItem>
                <SelectItem value="template-3">Custom Template</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Choose a certificate template for course completion
            </p>
          </div>

          {settings.certificate_template_id && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Certificate Preview</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Certificate will be automatically generated upon course completion
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Visibility & Access
          </CardTitle>
          <CardDescription>
            Control who can see and access this course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="visibility">Course Visibility</Label>
            <Select
              value={settings.visibility}
              onValueChange={(value) => handleChange('visibility', value as 'public' | 'private' | 'organization')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Private</span>
                  </div>
                </SelectItem>
                <SelectItem value="organization">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Organization Only</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {settings.visibility === 'public' && 'Course is visible to all users'}
              {settings.visibility === 'private' && 'Course is only visible to enrolled learners'}
              {settings.visibility === 'organization' && 'Course is visible to organization members only'}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Prerequisites</Label>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                No prerequisites selected
              </div>
              <div className="text-xs text-muted-foreground">
                Prerequisites help ensure learners have the necessary background knowledge
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Due Date Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Due Date & Scheduling
          </CardTitle>
          <CardDescription>
            Set deadlines and scheduling options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="due-date">Due Date (Optional)</Label>
            <Input
              id="due-date"
              type="datetime-local"
              value={settings.due_date ? new Date(settings.due_date).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('due_date', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Set a deadline for course completion
            </p>
          </div>

          {settings.due_date && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Due: {new Date(settings.due_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Settings Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Passing Threshold</span>
              <Badge variant="outline">{settings.passing_threshold}%</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Max Attempts</span>
              <Badge variant="outline">{settings.max_attempts}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Self-paced</span>
              <Badge variant={settings.is_self_paced ? 'default' : 'secondary'}>
                {settings.is_self_paced ? 'Yes' : 'No'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Visibility</span>
              <Badge variant="outline">
                {settings.visibility.charAt(0).toUpperCase() + settings.visibility.slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Certificate</span>
              <Badge variant={settings.certificate_template_id ? 'default' : 'secondary'}>
                {settings.certificate_template_id ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
