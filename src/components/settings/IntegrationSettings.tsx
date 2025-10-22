import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plug, 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle, 
  Info,
  Webhook,
  Database,
  Calendar,
  MessageSquare,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface IntegrationSettingsProps {
  onChange?: () => void;
}

interface APIKey {
  id: string;
  name: string;
  description: string;
  key: string;
  permissions: string[];
  lastUsed: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'revoked';
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'failed';
  lastTriggered?: string;
  secret: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  config: Record<string, any>;
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ onChange }) => {
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [showWebhookSecret, setShowWebhookSecret] = useState<Record<string, boolean>>({});

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      description: 'Main API key for production environment',
      key: 'sk_live_1234567890abcdef',
      permissions: ['read', 'write', 'admin'],
      lastUsed: '2024-01-07T14:30:00Z',
      expiresAt: '2024-12-31T23:59:59Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Development API Key',
      description: 'API key for development and testing',
      key: 'sk_test_abcdef1234567890',
      permissions: ['read', 'write'],
      lastUsed: '2024-01-06T10:15:00Z',
      status: 'active'
    },
    {
      id: '3',
      name: 'Legacy API Key',
      description: 'Old API key for backward compatibility',
      key: 'sk_legacy_xyz789',
      permissions: ['read'],
      lastUsed: '2023-12-15T09:30:00Z',
      expiresAt: '2024-01-31T23:59:59Z',
      status: 'expired'
    }
  ]);

  const [webhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'Content Updates',
      url: 'https://api.example.com/webhooks/content',
      events: ['content.created', 'content.updated', 'content.deleted'],
      status: 'active',
      lastTriggered: '2024-01-07T14:30:00Z',
      secret: 'whsec_1234567890abcdef'
    },
    {
      id: '2',
      name: 'User Events',
      url: 'https://api.example.com/webhooks/users',
      events: ['user.created', 'user.updated', 'user.deleted'],
      status: 'active',
      lastTriggered: '2024-01-07T12:15:00Z',
      secret: 'whsec_abcdef1234567890'
    },
    {
      id: '3',
      name: 'Analytics Data',
      url: 'https://analytics.example.com/webhook',
      events: ['analytics.daily', 'analytics.weekly'],
      status: 'failed',
      lastTriggered: '2024-01-05T18:45:00Z',
      secret: 'whsec_xyz789123456'
    }
  ]);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Slack',
      description: 'Send notifications and updates to Slack channels',
      icon: MessageSquare,
      status: 'connected',
      lastSync: '2024-01-07T14:30:00Z',
      config: {
        channel: '#training-updates',
        botToken: 'xoxb-1234567890-abcdef',
        enabled: true
      }
    },
    {
      id: '2',
      name: 'Microsoft Teams',
      description: 'Integrate with Microsoft Teams for notifications',
      icon: Users,
      status: 'connected',
      lastSync: '2024-01-07T12:15:00Z',
      config: {
        webhookUrl: 'https://outlook.office.com/webhook/123456',
        enabled: true
      }
    },
    {
      id: '3',
      name: 'Google Calendar',
      description: 'Sync training schedules with Google Calendar',
      icon: Calendar,
      status: 'disconnected',
      config: {
        calendarId: 'primary',
        enabled: false
      }
    },
    {
      id: '4',
      name: 'Salesforce',
      description: 'Sync user data and training records with Salesforce',
      icon: Database,
      status: 'error',
      lastSync: '2024-01-05T10:30:00Z',
      config: {
        instanceUrl: 'https://company.salesforce.com',
        enabled: true
      }
    }
  ]);

  const handleToggleApiKeyVisibility = (keyId: string) => {
    setShowApiKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const handleToggleWebhookSecretVisibility = (webhookId: string) => {
    setShowWebhookSecret(prev => ({ ...prev, [webhookId]: !prev[webhookId] }));
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleRegenerateApiKey = (keyId: string) => {
    if (window.confirm('Are you sure you want to regenerate this API key? The old key will be invalidated.')) {
      const newKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setApiKeys(prev =>
        prev.map(key =>
          key.id === keyId 
            ? { ...key, key: newKey, lastUsed: new Date().toISOString() }
            : key
        )
      );
      onChange?.();
      toast.success('API key regenerated successfully');
    }
  };

  const handleRevokeApiKey = (keyId: string) => {
    if (window.confirm('Are you sure you want to revoke this API key?')) {
      setApiKeys(prev =>
        prev.map(key =>
          key.id === keyId 
            ? { ...key, status: 'revoked' as const }
            : key
        )
      );
      onChange?.();
      toast.success('API key revoked successfully');
    }
  };

  const handleTestWebhook = () => {
    toast.info('Testing webhook...');
    // Simulate webhook test
    setTimeout(() => {
      toast.success('Webhook test successful');
    }, 1000);
  };

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: integration.status === 'connected' ? 'disconnected' : 'connected',
              lastSync: integration.status === 'connected' ? undefined : new Date().toISOString()
            }
          : integration
      )
    );
    onChange?.();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-success/10 text-success border-success/20';
      case 'inactive':
      case 'disconnected':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      case 'expired':
      case 'revoked':
      case 'error':
      case 'failed':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* API Keys */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-primary" />
            <span>API Keys</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id} className="hover:shadow-elevation-200 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{apiKey.name}</h3>
                    <p className="text-sm text-muted-foreground">{apiKey.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(apiKey.status)}>
                        {apiKey.status}
                      </Badge>
                      {apiKey.expiresAt && (
                        <Badge variant="outline" className="text-xs">
                          Expires: {new Date(apiKey.expiresAt).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegenerateApiKey(apiKey.id)}
                      className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeApiKey(apiKey.id)}
                      className="hover:bg-error/10 hover:border-error transition-all duration-200"
                    >
                      Revoke
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">API Key</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        value={apiKey.key}
                        type={showApiKey[apiKey.id] ? 'text' : 'password'}
                        readOnly
                        className="input-field font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleApiKeyVisibility(apiKey.id)}
                        className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                      >
                        {showApiKey[apiKey.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyToClipboard(apiKey.key)}
                        className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">Permissions</Label>
                      <p className="font-medium">{apiKey.permissions.join(', ')}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Last Used</Label>
                      <p className="font-medium">{formatDate(apiKey.lastUsed)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            className="w-full hover:scale-105 transition-all duration-200"
          >
            <Key className="h-4 w-4 mr-2" />
            Create New API Key
          </Button>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Webhook className="h-5 w-5 text-primary" />
            <span>Webhooks</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id} className="hover:shadow-elevation-200 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{webhook.name}</h3>
                    <p className="text-sm text-muted-foreground">{webhook.url}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(webhook.status)}>
                        {webhook.status}
                      </Badge>
                      {webhook.lastTriggered && (
                        <Badge variant="outline" className="text-xs">
                          Last triggered: {formatDate(webhook.lastTriggered)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestWebhook}
                      className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-error/10 hover:border-error transition-all duration-200"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Webhook Secret</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        value={webhook.secret}
                        type={showWebhookSecret[webhook.id] ? 'text' : 'password'}
                        readOnly
                        className="input-field font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleWebhookSecretVisibility(webhook.id)}
                        className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                      >
                        {showWebhookSecret[webhook.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyToClipboard(webhook.secret)}
                        className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Events</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            className="w-full hover:scale-105 transition-all duration-200"
          >
            <Webhook className="h-4 w-4 mr-2" />
            Create New Webhook
          </Button>
        </CardContent>
      </Card>

      {/* Third-Party Integrations */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plug className="h-5 w-5 text-primary" />
            <span>Third-Party Integrations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <Card key={integration.id} className="hover:shadow-elevation-200 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                        {integration.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            Last sync: {formatDate(integration.lastSync)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                      <Switch
                        checked={integration.status === 'connected'}
                        onCheckedChange={() => handleToggleIntegration(integration.id)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-primary" />
            <span>Integration Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-success/10">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-success mb-1">2</div>
              <div className="text-sm text-muted-foreground">Active Integrations</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-info/10">
              <Webhook className="h-8 w-8 text-info mx-auto mb-2" />
              <div className="text-2xl font-bold text-info mb-1">3</div>
              <div className="text-sm text-muted-foreground">Webhooks</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/10">
              <Key className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary mb-1">3</div>
              <div className="text-sm text-muted-foreground">API Keys</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;