import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Users, 
  Settings, 
  Download, 
  Copy, 
  Info,
  ExternalLink,
  Save,
  TestTube
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SSOProvisioningSettingsProps {
  onChange?: () => void;
}

interface SSOConfig {
  enabled: boolean;
  provider: 'saml' | 'oauth' | 'oidc';
  name: string;
  description: string;
  entityId: string;
  ssoUrl: string;
  x509Certificate: string;
  logoutUrl?: string;
  nameIdFormat: string;
  attributeMapping: {
    email: string;
    firstName: string;
    lastName: string;
    groups: string;
  };
  provisioning: {
    enabled: boolean;
    scimEndpoint: string;
    scimToken: string;
    autoProvision: boolean;
    deprovisionOnDisable: boolean;
  };
  status: 'active' | 'inactive' | 'testing' | 'error';
  lastSync?: string;
  lastError?: string;
}

const SSOProvisioningSettings: React.FC<SSOProvisioningSettingsProps> = ({ onChange }) => {
  const [ssoConfig, setSsoConfig] = useState<SSOConfig>({
    enabled: true,
    provider: 'saml',
    name: 'Corporate SSO',
    description: 'Single Sign-On integration with corporate identity provider',
    entityId: 'https://winbro.com/saml/metadata',
    ssoUrl: 'https://corp.example.com/saml/sso',
    x509Certificate: `-----BEGIN CERTIFICATE-----
MIICdTCCAd4CAQAwDQYJKoZIhvcNAQEFBQAwXjELMAkGA1UEBhMCVVMxCzAJBgNV
BAgTAkNBMRYwFAYDVQQHEw1TYW4gRnJhbmNpc2NvMRowGAYDVQQKExFNeSBDb21w
YW55IEx0ZC4xGTAXBgNVBAMTEGV4YW1wbGUuY29tIENBMB4XDTE0MDcwOTAwMDAw
MFoXDTE1MDcwOTAwMDAwMFowXjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYw
FAYDVQQHEw1TYW4gRnJhbmNpc2NvMRowGAYDVQQKExFNeSBDb21wYW55IEx0ZC4x
GTAXBgNVBAMTEGV4YW1wbGUuY29tIENBMA0GCSqGSIb3DQEBBQUAA4GNADCBiQKB
gQC7vbqajU4eHxGdJfqjJw==
-----END CERTIFICATE-----`,
    logoutUrl: 'https://corp.example.com/saml/slo',
    nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    attributeMapping: {
      email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
      firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
      lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
      groups: 'http://schemas.xmlsoap.org/claims/Group'
    },
    provisioning: {
      enabled: true,
      scimEndpoint: 'https://api.winbro.com/scim/v2',
      scimToken: 'scim_token_here',
      autoProvision: true,
      deprovisionOnDisable: true
    },
    status: 'active',
    lastSync: '2024-01-07T14:30:00Z'
  });

  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setSsoConfig(prev => {
      const newConfig = { ...prev } as any;
      const keys = field.split('.');
      let current = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
    onChange?.();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('SSO configuration saved successfully');
    } catch (error) {
      toast.error('Failed to save SSO configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      // Simulate test
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('SSO connection test successful');
    } catch (error) {
      toast.error('SSO connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleDownloadMetadata = () => {
    const metadata = `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${ssoConfig.entityId}">
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${ssoConfig.ssoUrl}" index="0" isDefault="true"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`;
    
    const blob = new Blob([metadata], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'winbro-saml-metadata.xml';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Metadata file downloaded');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'inactive':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      case 'testing':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'error':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* SSO Status */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>SSO Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "h-3 w-3 rounded-full",
                ssoConfig.status === 'active' && "bg-success",
                ssoConfig.status === 'inactive' && "bg-muted-foreground",
                ssoConfig.status === 'testing' && "bg-secondary",
                ssoConfig.status === 'error' && "bg-error"
              )} />
              <div>
                <p className="font-medium">
                  {ssoConfig.status === 'active' && 'SSO is active and configured'}
                  {ssoConfig.status === 'inactive' && 'SSO is disabled'}
                  {ssoConfig.status === 'testing' && 'SSO is in testing mode'}
                  {ssoConfig.status === 'error' && 'SSO configuration has errors'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ssoConfig.lastSync && `Last sync: ${new Date(ssoConfig.lastSync).toLocaleString()}`}
                  {ssoConfig.lastError && `Last error: ${ssoConfig.lastError}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(ssoConfig.status)}>
                {ssoConfig.status.toUpperCase()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTest}
                disabled={isTesting}
                className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
              >
                <TestTube className={cn("h-4 w-4 mr-2", isTesting && "animate-spin")} />
                {isTesting ? 'Testing...' : 'Test'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SSO Configuration */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>SSO Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={ssoConfig.enabled}
              onCheckedChange={(checked) => handleInputChange('enabled', checked)}
            />
            <Label className="text-sm font-medium">Enable SSO</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sso-name">SSO Provider Name</Label>
              <Input
                id="sso-name"
                value={ssoConfig.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-field"
                placeholder="e.g., Corporate SSO"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sso-provider">Provider Type</Label>
              <select
                id="sso-provider"
                value={ssoConfig.provider}
                onChange={(e) => handleInputChange('provider', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="saml">SAML 2.0</option>
                <option value="oauth">OAuth 2.0</option>
                <option value="oidc">OpenID Connect</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sso-description">Description</Label>
            <Textarea
              id="sso-description"
              value={ssoConfig.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input-field min-h-[80px]"
              placeholder="Describe your SSO integration..."
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SAML Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="entity-id">Entity ID</Label>
                <div className="flex space-x-2">
                  <Input
                    id="entity-id"
                    value={ssoConfig.entityId}
                    onChange={(e) => handleInputChange('entityId', e.target.value)}
                    className="input-field"
                    placeholder="https://winbro.com/saml/metadata"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(ssoConfig.entityId)}
                    className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sso-url">SSO URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="sso-url"
                    value={ssoConfig.ssoUrl}
                    onChange={(e) => handleInputChange('ssoUrl', e.target.value)}
                    className="input-field"
                    placeholder="https://corp.example.com/saml/sso"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(ssoConfig.ssoUrl, '_blank')}
                    className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logout-url">Logout URL (Optional)</Label>
                <Input
                  id="logout-url"
                  value={ssoConfig.logoutUrl || ''}
                  onChange={(e) => handleInputChange('logoutUrl', e.target.value)}
                  className="input-field"
                  placeholder="https://corp.example.com/saml/slo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name-id-format">Name ID Format</Label>
                <select
                  id="name-id-format"
                  value={ssoConfig.nameIdFormat}
                  onChange={(e) => handleInputChange('nameIdFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">Email Address</option>
                  <option value="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">Unspecified</option>
                  <option value="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">Persistent</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="x509-certificate">X.509 Certificate</Label>
              <div className="space-y-2">
                <Textarea
                  id="x509-certificate"
                  value={ssoConfig.x509Certificate}
                  onChange={(e) => handleInputChange('x509Certificate', e.target.value)}
                  className="input-field min-h-[120px] font-mono text-xs"
                  placeholder="Paste your X.509 certificate here..."
                />
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(ssoConfig.x509Certificate)}
                    className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Certificate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadMetadata}
                    className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Metadata
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Attribute Mapping</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email-attribute">Email Attribute</Label>
                <Input
                  id="email-attribute"
                  value={ssoConfig.attributeMapping.email}
                  onChange={(e) => handleInputChange('attributeMapping.email', e.target.value)}
                  className="input-field"
                  placeholder="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstname-attribute">First Name Attribute</Label>
                <Input
                  id="firstname-attribute"
                  value={ssoConfig.attributeMapping.firstName}
                  onChange={(e) => handleInputChange('attributeMapping.firstName', e.target.value)}
                  className="input-field"
                  placeholder="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastname-attribute">Last Name Attribute</Label>
                <Input
                  id="lastname-attribute"
                  value={ssoConfig.attributeMapping.lastName}
                  onChange={(e) => handleInputChange('attributeMapping.lastName', e.target.value)}
                  className="input-field"
                  placeholder="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="groups-attribute">Groups Attribute</Label>
                <Input
                  id="groups-attribute"
                  value={ssoConfig.attributeMapping.groups}
                  onChange={(e) => handleInputChange('attributeMapping.groups', e.target.value)}
                  className="input-field"
                  placeholder="http://schemas.xmlsoap.org/claims/Group"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SCIM Provisioning */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>SCIM Provisioning</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={ssoConfig.provisioning.enabled}
              onCheckedChange={(checked) => handleInputChange('provisioning.enabled', checked)}
            />
            <Label className="text-sm font-medium">Enable SCIM Provisioning</Label>
          </div>

          {ssoConfig.provisioning.enabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="scim-endpoint">SCIM Endpoint</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="scim-endpoint"
                      value={ssoConfig.provisioning.scimEndpoint}
                      onChange={(e) => handleInputChange('provisioning.scimEndpoint', e.target.value)}
                      className="input-field"
                      placeholder="https://api.winbro.com/scim/v2"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(ssoConfig.provisioning.scimEndpoint)}
                      className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scim-token">SCIM Token</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="scim-token"
                      type="password"
                      value={ssoConfig.provisioning.scimToken}
                      onChange={(e) => handleInputChange('provisioning.scimToken', e.target.value)}
                      className="input-field"
                      placeholder="Enter SCIM token"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(ssoConfig.provisioning.scimToken)}
                      className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={ssoConfig.provisioning.autoProvision}
                    onCheckedChange={(checked) => handleInputChange('provisioning.autoProvision', checked)}
                  />
                  <Label className="text-sm font-medium">Auto-provision users</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={ssoConfig.provisioning.deprovisionOnDisable}
                    onCheckedChange={(checked) => handleInputChange('provisioning.deprovisionOnDisable', checked)}
                  />
                  <Label className="text-sm font-medium">Deprovision users when disabled</Label>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="shadow-elevation-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Changes are saved automatically. Test your configuration before going live.</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleTest}
                disabled={isTesting}
                className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
              >
                <TestTube className={cn("h-4 w-4 mr-2", isTesting && "animate-spin")} />
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="hover:scale-105 transition-all duration-200"
              >
                <Save className={cn("h-4 w-4 mr-2", isSaving && "animate-spin")} />
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SSOProvisioningSettings;