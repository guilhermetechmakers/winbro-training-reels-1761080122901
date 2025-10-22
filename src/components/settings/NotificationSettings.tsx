import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Settings, 
  CheckCircle, 
  Info,
  Users,
  Video,
  FileText,
  Shield,
  CreditCard,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface NotificationSettingsProps {
  onChange?: () => void;
}

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  channels: {
    email: boolean;
    inApp: boolean;
    push: boolean;
  };
}

interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  channels: {
    email: boolean;
    inApp: boolean;
    push: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly' | 'never';
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onChange }) => {
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: '1',
      name: 'User Management',
      description: 'Notifications about user accounts, roles, and permissions',
      icon: Users,
      enabled: true,
      channels: {
        email: true,
        inApp: true,
        push: false
      }
    },
    {
      id: '2',
      name: 'Content Updates',
      description: 'Notifications about new content, updates, and approvals',
      icon: Video,
      enabled: true,
      channels: {
        email: true,
        inApp: true,
        push: true
      }
    },
    {
      id: '3',
      name: 'System Alerts',
      description: 'Critical system notifications and security alerts',
      icon: Shield,
      enabled: true,
      channels: {
        email: true,
        inApp: true,
        push: true
      }
    },
    {
      id: '4',
      name: 'Billing & Payments',
      description: 'Payment confirmations, invoices, and billing updates',
      icon: CreditCard,
      enabled: true,
      channels: {
        email: true,
        inApp: false,
        push: false
      }
    },
    {
      id: '5',
      name: 'Reports & Analytics',
      description: 'Scheduled reports and analytics summaries',
      icon: FileText,
      enabled: false,
      channels: {
        email: false,
        inApp: true,
        push: false
      }
    }
  ]);

  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'New User Registration',
      description: 'Notify when a new user registers for the platform',
      category: 'User Management',
      enabled: true,
      channels: {
        email: true,
        inApp: true,
        push: false
      },
      frequency: 'immediate'
    },
    {
      id: '2',
      name: 'Content Approval Required',
      description: 'Notify when content needs approval or review',
      category: 'Content Updates',
      enabled: true,
      channels: {
        email: true,
        inApp: true,
        push: true
      },
      frequency: 'immediate'
    },
    {
      id: '3',
      name: 'System Maintenance',
      description: 'Notify about scheduled maintenance windows',
      category: 'System Alerts',
      enabled: true,
      channels: {
        email: true,
        inApp: true,
        push: true
      },
      frequency: 'immediate'
    },
    {
      id: '4',
      name: 'Payment Failed',
      description: 'Notify when a payment fails or subscription expires',
      category: 'Billing & Payments',
      enabled: true,
      channels: {
        email: true,
        inApp: false,
        push: false
      },
      frequency: 'immediate'
    },
    {
      id: '5',
      name: 'Weekly Usage Report',
      description: 'Weekly summary of platform usage and activity',
      category: 'Reports & Analytics',
      enabled: false,
      channels: {
        email: false,
        inApp: true,
        push: false
      },
      frequency: 'weekly'
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    pushNotifications: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    digestFrequency: 'daily' as 'immediate' | 'daily' | 'weekly'
  });

  const handleCategoryToggle = (categoryId: string) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === categoryId 
          ? { ...category, enabled: !category.enabled }
          : category
      )
    );
    onChange?.();
  };

  const handleChannelToggle = (categoryId: string, channel: 'email' | 'inApp' | 'push') => {
    setCategories(prev =>
      prev.map(category =>
        category.id === categoryId 
          ? { 
              ...category, 
              channels: { 
                ...category.channels, 
                [channel]: !category.channels[channel] 
              }
            }
          : category
      )
    );
    onChange?.();
  };

  const handleTemplateToggle = (templateId: string) => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === templateId 
          ? { ...template, enabled: !template.enabled }
          : template
      )
    );
    onChange?.();
  };

  const handleTemplateChannelToggle = (templateId: string, channel: 'email' | 'inApp' | 'push') => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === templateId 
          ? { 
              ...template, 
              channels: { 
                ...template.channels, 
                [channel]: !template.channels[channel] 
              }
            }
          : template
      )
    );
    onChange?.();
  };

  const handleGlobalSettingChange = (field: string, value: any) => {
    setGlobalSettings(prev => ({ ...prev, [field]: value }));
    onChange?.();
  };

  const handleQuietHoursChange = (field: string, value: any) => {
    setGlobalSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value
      }
    }));
    onChange?.();
  };

  const handleTestNotification = (type: 'email' | 'inApp' | 'push') => {
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notification sent successfully`);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'inApp':
        return <Bell className="h-4 w-4" />;
      case 'push':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getChannelColor = (channel: string, enabled: boolean) => {
    if (!enabled) return 'text-muted-foreground';
    switch (channel) {
      case 'email':
        return 'text-blue-600';
      case 'inApp':
        return 'text-green-600';
      case 'push':
        return 'text-purple-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Global Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Notification Channels</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={globalSettings.emailNotifications}
                  onCheckedChange={(checked) => handleGlobalSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">In-App Notifications</p>
                    <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                  </div>
                </div>
                <Switch
                  checked={globalSettings.inAppNotifications}
                  onCheckedChange={(checked) => handleGlobalSettingChange('inAppNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Send push notifications to your device</p>
                  </div>
                </div>
                <Switch
                  checked={globalSettings.pushNotifications}
                  onCheckedChange={(checked) => handleGlobalSettingChange('pushNotifications', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Quiet Hours</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Quiet Hours</p>
                <p className="text-sm text-muted-foreground">
                  Pause non-critical notifications during specified hours
                </p>
              </div>
              <Switch
                checked={globalSettings.quietHours.enabled}
                onCheckedChange={(checked) => handleQuietHoursChange('enabled', checked)}
              />
            </div>

            {globalSettings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <input
                    type="time"
                    value={globalSettings.quietHours.start}
                    onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Time</label>
                  <input
                    type="time"
                    value={globalSettings.quietHours.end}
                    onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Digest Frequency</h3>
            <div className="space-y-2">
              <select
                value={globalSettings.digestFrequency}
                onChange={(e) => handleGlobalSettingChange('digestFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Choose how often to receive digest notifications
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handleTestNotification('email')}
              className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <Mail className="h-4 w-4 mr-2" />
              Test Email
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTestNotification('inApp')}
              className="hover:bg-green-50 hover:border-green-300 transition-all duration-200"
            >
              <Bell className="h-4 w-4 mr-2" />
              Test In-App
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTestNotification('push')}
              className="hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Test Push
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Notification Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-elevation-200 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={category.enabled}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                  </div>

                  {category.enabled && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Notification Channels:</p>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(category.channels).map(([channel, enabled]) => (
                          <div key={channel} className="flex items-center space-x-2">
                            <Switch
                              checked={enabled}
                              onCheckedChange={() => handleChannelToggle(category.id, channel as any)}
                            />
                            <div className="flex items-center space-x-1">
                              <span className={cn(
                                "text-sm",
                                getChannelColor(channel, enabled)
                              )}>
                                {getChannelIcon(channel)}
                              </span>
                              <span className={cn(
                                "text-sm capitalize",
                                getChannelColor(channel, enabled)
                              )}>
                                {channel === 'inApp' ? 'In-App' : channel}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Notification Templates */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Notification Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-elevation-200 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.frequency}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={template.enabled}
                    onCheckedChange={() => handleTemplateToggle(template.id)}
                  />
                </div>

                {template.enabled && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Channels:</p>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(template.channels).map(([channel, enabled]) => (
                        <div key={channel} className="flex items-center space-x-2">
                          <Switch
                            checked={enabled}
                            onCheckedChange={() => handleTemplateChannelToggle(template.id, channel as any)}
                          />
                          <div className="flex items-center space-x-1">
                            <span className={cn(
                              "text-sm",
                              getChannelColor(channel, enabled)
                            )}>
                              {getChannelIcon(channel)}
                            </span>
                            <span className={cn(
                              "text-sm capitalize",
                              getChannelColor(channel, enabled)
                            )}>
                              {channel === 'inApp' ? 'In-App' : channel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Notification Status */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-primary" />
            <span>Notification Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-success/10">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-success mb-1">Active</div>
              <div className="text-sm text-muted-foreground">Notification Status</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-info/10">
              <Clock className="h-8 w-8 text-info mx-auto mb-2" />
              <div className="text-2xl font-bold text-info mb-1">24h</div>
              <div className="text-sm text-muted-foreground">Last Notification</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/10">
              <Bell className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary mb-1">12</div>
              <div className="text-sm text-muted-foreground">Unread Notifications</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;