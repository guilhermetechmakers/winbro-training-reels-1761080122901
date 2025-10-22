import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Key, 
  Shield, 
  Users, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Server,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface SecuritySettingsProps {
  onChange?: () => void;
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: string;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'password_change' | 'failed_login' | 'suspicious_activity';
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onChange }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([
    {
      id: '1',
      name: 'Two-Factor Authentication',
      description: 'Require 2FA for all user accounts',
      enabled: true,
      severity: 'high',
      lastUpdated: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Password Complexity',
      description: 'Enforce strong password requirements',
      enabled: true,
      severity: 'medium',
      lastUpdated: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Session Timeout',
      description: 'Automatically log out inactive users after 30 minutes',
      enabled: true,
      severity: 'medium',
      lastUpdated: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name: 'IP Whitelist',
      description: 'Restrict access to specific IP addresses',
      enabled: false,
      severity: 'high',
      lastUpdated: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      name: 'Failed Login Protection',
      description: 'Lock accounts after 5 failed login attempts',
      enabled: true,
      severity: 'high',
      lastUpdated: '2024-01-01T00:00:00Z'
    },
    {
      id: '6',
      name: 'Data Encryption',
      description: 'Encrypt all data at rest and in transit',
      enabled: true,
      severity: 'critical',
      lastUpdated: '2024-01-01T00:00:00Z'
    }
  ]);

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: '1',
      device: 'MacBook Pro',
      browser: 'Chrome 120.0',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.100',
      lastActive: '2024-01-07T14:30:00Z',
      isCurrent: true
    },
    {
      id: '2',
      device: 'iPhone 15',
      browser: 'Safari 17.0',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.101',
      lastActive: '2024-01-07T12:15:00Z',
      isCurrent: false
    },
    {
      id: '3',
      device: 'Windows PC',
      browser: 'Edge 120.0',
      location: 'New York, NY',
      ipAddress: '203.0.113.42',
      lastActive: '2024-01-06T18:45:00Z',
      isCurrent: false
    }
  ]);

  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login',
      description: 'Successful login from MacBook Pro',
      timestamp: '2024-01-07T14:30:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'low'
    },
    {
      id: '2',
      type: 'failed_login',
      description: 'Failed login attempt from unknown device',
      timestamp: '2024-01-07T13:45:00Z',
      ipAddress: '203.0.113.42',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'high'
    },
    {
      id: '3',
      type: 'password_change',
      description: 'Password changed successfully',
      timestamp: '2024-01-06T10:20:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'medium'
    },
    {
      id: '4',
      type: 'suspicious_activity',
      description: 'Multiple failed login attempts detected',
      timestamp: '2024-01-05T16:30:00Z',
      ipAddress: '198.51.100.42',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      severity: 'critical'
    }
  ]);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    onChange?.();
  };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    // Simulate password change
    toast.success('Password changed successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handlePolicyToggle = (policyId: string) => {
    setSecurityPolicies(prev =>
      prev.map(policy =>
        policy.id === policyId 
          ? { ...policy, enabled: !policy.enabled, lastUpdated: new Date().toISOString() }
          : policy
      )
    );
    onChange?.();
  };

  const handleTerminateSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to terminate this session?')) {
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      toast.success('Session terminated successfully');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      case 'medium':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'critical':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'logout':
        return <Lock className="h-4 w-4 text-muted-foreground" />;
      case 'password_change':
        return <Key className="h-4 w-4 text-info" />;
      case 'failed_login':
        return <AlertTriangle className="h-4 w-4 text-error" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4 text-error" />;
      default:
        return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return <Smartphone className="h-4 w-4" />;
    } else if (device.toLowerCase().includes('macbook') || device.toLowerCase().includes('windows')) {
      return <Monitor className="h-4 w-4" />;
    } else {
      return <Server className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-primary" />
            <span>Change Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="input-field pr-10"
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="input-field pr-10"
                placeholder="Enter new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="input-field pr-10"
                placeholder="Confirm new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            onClick={handlePasswordSubmit}
            className="hover:scale-105 transition-all duration-200"
          >
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Security Policies */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Security Policies</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityPolicies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-elevation-200 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-semibold">{policy.name}</h3>
                      <p className="text-sm text-muted-foreground">{policy.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(policy.severity)}>
                      {policy.severity}
                    </Badge>
                    <Switch
                      checked={policy.enabled}
                      onCheckedChange={() => handlePolicyToggle(policy.id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Active Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-elevation-200 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(session.device)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{session.device}</h3>
                        {session.isCurrent && (
                          <Badge variant="secondary">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.browser} • {session.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        IP: {session.ipAddress} • Last active: {new Date(session.lastActive).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                      className="hover:bg-error/10 hover:border-error transition-all duration-200"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Terminate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Recent Security Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-elevation-200 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getEventTypeIcon(event.type)}
                    <div>
                      <h3 className="font-semibold">{event.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()} • IP: {event.ipAddress}
                      </p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Security Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-success/10">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-success mb-1">Secure</div>
              <div className="text-sm text-muted-foreground">Overall Security Score</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-info/10">
              <Clock className="h-8 w-8 text-info mx-auto mb-2" />
              <div className="text-2xl font-bold text-info mb-1">24h</div>
              <div className="text-sm text-muted-foreground">Last Security Scan</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/10">
              <Globe className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary mb-1">3</div>
              <div className="text-sm text-muted-foreground">Active Sessions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;