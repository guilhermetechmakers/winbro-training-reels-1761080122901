import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Database, 
  Download, 
  AlertTriangle, 
  Clock, 
  Shield, 
  FileText,
  HardDrive,
  Users,
  Video,
  CheckCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DataRetentionSettingsProps {
  onChange?: () => void;
}

interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  dataType: 'user_data' | 'content' | 'analytics' | 'logs' | 'backups';
  retentionPeriod: number; // in days
  action: 'delete' | 'archive' | 'anonymize';
  enabled: boolean;
  lastApplied?: string;
  nextScheduled?: string;
}

interface DataExport {
  id: string;
  name: string;
  dataTypes: string[];
  format: 'json' | 'csv' | 'xml';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  size?: number;
}

const DataRetentionSettings: React.FC<DataRetentionSettingsProps> = ({ onChange }) => {
  const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>([
    {
      id: '1',
      name: 'User Data Retention',
      description: 'Retain user account data and personal information',
      dataType: 'user_data',
      retentionPeriod: 2555, // 7 years
      action: 'delete',
      enabled: true,
      lastApplied: '2024-01-01T00:00:00Z',
      nextScheduled: '2024-01-08T00:00:00Z'
    },
    {
      id: '2',
      name: 'Content Retention',
      description: 'Retain video content and training materials',
      dataType: 'content',
      retentionPeriod: 3650, // 10 years
      action: 'archive',
      enabled: true,
      lastApplied: '2024-01-01T00:00:00Z',
      nextScheduled: '2024-01-08T00:00:00Z'
    },
    {
      id: '3',
      name: 'Analytics Data',
      description: 'Retain usage analytics and performance data',
      dataType: 'analytics',
      retentionPeriod: 1095, // 3 years
      action: 'anonymize',
      enabled: true,
      lastApplied: '2024-01-01T00:00:00Z',
      nextScheduled: '2024-01-08T00:00:00Z'
    },
    {
      id: '4',
      name: 'System Logs',
      description: 'Retain system and application logs',
      dataType: 'logs',
      retentionPeriod: 90, // 3 months
      action: 'delete',
      enabled: true,
      lastApplied: '2024-01-01T00:00:00Z',
      nextScheduled: '2024-01-08T00:00:00Z'
    },
    {
      id: '5',
      name: 'Backup Data',
      description: 'Retain system backups and snapshots',
      dataType: 'backups',
      retentionPeriod: 365, // 1 year
      action: 'delete',
      enabled: true,
      lastApplied: '2024-01-01T00:00:00Z',
      nextScheduled: '2024-01-08T00:00:00Z'
    }
  ]);

  const [dataExports, setDataExports] = useState<DataExport[]>([
    {
      id: '1',
      name: 'Complete Data Export',
      dataTypes: ['user_data', 'content', 'analytics'],
      format: 'json',
      status: 'completed',
      requestedAt: '2024-01-05T10:00:00Z',
      completedAt: '2024-01-05T10:15:00Z',
      downloadUrl: '#',
      size: 2048576 // 2MB
    },
    {
      id: '2',
      name: 'User Data Only',
      dataTypes: ['user_data'],
      format: 'csv',
      status: 'processing',
      requestedAt: '2024-01-07T14:30:00Z'
    }
  ]);

  const [isExporting, setIsExporting] = useState(false);

  const handlePolicyChange = (policyId: string, field: keyof RetentionPolicy, value: any) => {
    setRetentionPolicies(prev =>
      prev.map(policy =>
        policy.id === policyId ? { ...policy, [field]: value } : policy
      )
    );
    onChange?.();
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newExport: DataExport = {
        id: Date.now().toString(),
        name: `Data Export ${new Date().toLocaleString()}`,
        dataTypes: ['user_data', 'content', 'analytics'],
        format: 'json',
        status: 'processing',
        requestedAt: new Date().toISOString()
      };
      
      setDataExports(prev => [newExport, ...prev]);
      toast.success('Data export started. You will be notified when it\'s ready.');
    } catch (error) {
      toast.error('Failed to start data export');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadExport = (exportId: string) => {
    const exportItem = dataExports.find(e => e.id === exportId);
    if (exportItem?.downloadUrl) {
      toast.success('Download started');
    }
  };

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'user_data':
        return <Users className="h-4 w-4" />;
      case 'content':
        return <Video className="h-4 w-4" />;
      case 'analytics':
        return <FileText className="h-4 w-4" />;
      case 'logs':
        return <Database className="h-4 w-4" />;
      case 'backups':
        return <HardDrive className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const getDataTypeLabel = (dataType: string) => {
    switch (dataType) {
      case 'user_data':
        return 'User Data';
      case 'content':
        return 'Content';
      case 'analytics':
        return 'Analytics';
      case 'logs':
        return 'System Logs';
      case 'backups':
        return 'Backups';
      default:
        return dataType;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'delete':
        return 'bg-error/10 text-error border-error/20';
      case 'archive':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'anonymize':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'processing':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'pending':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      case 'failed':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <span>Data Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary mb-1">1,247</div>
              <div className="text-sm text-muted-foreground">User Records</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Video className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary mb-1">3,456</div>
              <div className="text-sm text-muted-foreground">Content Files</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <FileText className="h-8 w-8 text-info mx-auto mb-2" />
              <div className="text-2xl font-bold text-info mb-1">12.5 GB</div>
              <div className="text-sm text-muted-foreground">Analytics Data</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <HardDrive className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-success mb-1">45.2 GB</div>
              <div className="text-sm text-muted-foreground">Total Storage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retention Policies */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Data Retention Policies</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {retentionPolicies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-elevation-200 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getDataTypeIcon(policy.dataType)}
                    <div>
                      <h3 className="font-semibold">{policy.name}</h3>
                      <p className="text-sm text-muted-foreground">{policy.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getActionColor(policy.action)}>
                      {policy.action}
                    </Badge>
                    <Switch
                      checked={policy.enabled}
                      onCheckedChange={(checked) => handlePolicyChange(policy.id, 'enabled', checked)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-muted-foreground">Data Type</Label>
                    <p className="font-medium">{getDataTypeLabel(policy.dataType)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Retention Period</Label>
                    <p className="font-medium">{policy.retentionPeriod} days</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Next Scheduled</Label>
                    <p className="font-medium">
                      {policy.nextScheduled ? new Date(policy.nextScheduled).toLocaleDateString() : 'Not scheduled'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Last applied: {policy.lastApplied ? new Date(policy.lastApplied).toLocaleString() : 'Never'}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPeriod = prompt('Enter new retention period in days:', policy.retentionPeriod.toString());
                        if (newPeriod && !isNaN(parseInt(newPeriod))) {
                          handlePolicyChange(policy.id, 'retentionPeriod', parseInt(newPeriod));
                        }
                      }}
                      className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Edit Period
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-primary" />
            <span>Data Export</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-3">
              <Info className="h-5 w-5 text-info" />
              <div>
                <p className="font-medium">Export Your Data</p>
                <p className="text-sm text-muted-foreground">
                  Request a complete export of your organization's data in JSON, CSV, or XML format.
                </p>
              </div>
            </div>
            <Button
              onClick={handleExportData}
              disabled={isExporting}
              className="hover:scale-105 transition-all duration-200"
            >
              <Download className={cn("h-4 w-4 mr-2", isExporting && "animate-spin")} />
              {isExporting ? 'Exporting...' : 'Request Export'}
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Recent Exports</h3>
            {dataExports.map((exportItem) => (
              <Card key={exportItem.id} className="hover:shadow-elevation-200 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">{exportItem.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{exportItem.dataTypes.map(getDataTypeLabel).join(', ')}</span>
                          <span>{exportItem.format.toUpperCase()}</span>
                          {exportItem.size && <span>{formatFileSize(exportItem.size)}</span>}
                          <span>Requested: {new Date(exportItem.requestedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(exportItem.status)}>
                        {exportItem.status}
                      </Badge>
                      {exportItem.status === 'completed' && exportItem.downloadUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadExport(exportItem.id)}
                          className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Legal */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Compliance & Legal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold">GDPR Compliance</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Right to data portability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Right to erasure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Data processing transparency</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Consent management</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Data Security</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Encryption at rest</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Encryption in transit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Access controls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Audit logging</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <h4 className="font-medium mb-2">Important Notice</h4>
                <p className="text-sm text-muted-foreground">
                  Data retention policies are automatically applied based on your configuration. 
                  Once data is deleted or anonymized, it cannot be recovered. Please review your 
                  retention settings carefully and ensure they comply with applicable regulations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataRetentionSettings;