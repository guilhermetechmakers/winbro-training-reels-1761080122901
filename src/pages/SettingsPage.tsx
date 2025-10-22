import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Building2, 
  Library, 
  Shield, 
  FileText, 
  Database, 
  CreditCard, 
  Bell, 
  Key, 
  Plug,
  Save,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Import settings sections
import OrganizationSettings from '@/components/settings/OrganizationSettings';
import LibraryAllocationSettings from '@/components/settings/LibraryAllocationSettings';
import SSOProvisioningSettings from '@/components/settings/SSOProvisioningSettings';
import CertificateTemplateSettings from '@/components/settings/CertificateTemplateSettings';
import DataRetentionSettings from '@/components/settings/DataRetentionSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import IntegrationSettings from '@/components/settings/IntegrationSettings';

interface SettingsPageProps {}

const SettingsPage: React.FC<SettingsPageProps> = () => {
  const [activeTab, setActiveTab] = useState('organization');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const settingsTabs = [
    {
      id: 'organization',
      label: 'Organization',
      icon: Building2,
      description: 'Organization info, branding, and basic settings'
    },
    {
      id: 'library',
      label: 'Library Allocation',
      icon: Library,
      description: 'Machine models, quotas, and content access'
    },
    {
      id: 'sso',
      label: 'SSO & Provisioning',
      icon: Shield,
      description: 'SAML, SCIM, and enterprise authentication'
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: FileText,
      description: 'Certificate templates and branding'
    },
    {
      id: 'data',
      label: 'Data & Privacy',
      icon: Database,
      description: 'Retention policies and data export'
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: CreditCard,
      description: 'Subscription and payment settings'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Key,
      description: 'Access control and security policies'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Email and in-app notification preferences'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Plug,
      description: 'API keys and third-party integrations'
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = () => {
    toast.info('Refreshing settings...');
    // Refresh logic would go here
  };

  const handleTabChange = (value: string) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (!confirmed) return;
    }
    setActiveTab(value);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'organization':
        return <OrganizationSettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'library':
        return <LibraryAllocationSettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'sso':
        return <SSOProvisioningSettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'certificates':
        return <CertificateTemplateSettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'data':
        return <DataRetentionSettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'billing':
        return <BillingSettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'security':
        return <SecuritySettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'notifications':
        return <NotificationSettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'integrations':
        return <IntegrationSettings onChange={() => setHasUnsavedChanges(true)} />;
      default:
        return <OrganizationSettings onChange={() => setHasUnsavedChanges(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your organization's configuration and preferences
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="hover:scale-105 transition-all duration-200"
            >
              <Save className={cn("h-4 w-4 mr-2", isSaving && "animate-spin")} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Status Banner */}
        <Card className="mb-6 border-l-4 border-l-info shadow-elevation-100 bg-gradient-to-r from-info/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-info" />
              <span className="text-sm font-medium">
                Settings are automatically saved as you make changes. Use the Save button to apply critical changes.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 xl:grid-cols-9 bg-muted/50 rounded-xl p-1 h-auto">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg transition-all duration-200 p-3 flex flex-col items-center space-y-1 min-h-[80px]"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8 shadow-elevation-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary transition-all duration-200 hover:scale-105"
                onClick={() => setActiveTab('organization')}
              >
                <Building2 className="h-6 w-6" />
                <span className="text-sm font-medium">Organization</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-secondary/10 hover:border-secondary transition-all duration-200 hover:scale-105"
                onClick={() => setActiveTab('library')}
              >
                <Library className="h-6 w-6" />
                <span className="text-sm font-medium">Library</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-error/10 hover:border-error transition-all duration-200 hover:scale-105"
                onClick={() => setActiveTab('security')}
              >
                <Shield className="h-6 w-6" />
                <span className="text-sm font-medium">Security</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-success/10 hover:border-success transition-all duration-200 hover:scale-105"
                onClick={() => setActiveTab('billing')}
              >
                <CreditCard className="h-6 w-6" />
                <span className="text-sm font-medium">Billing</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;