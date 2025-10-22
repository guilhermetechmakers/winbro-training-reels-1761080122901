import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Upload, 
  Image as ImageIcon, 
  Globe, 
  Mail, 
  Phone,
  MapPin,
  CheckCircle,
  Edit,
  Save,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface OrganizationSettingsProps {
  onChange?: () => void;
}

interface OrganizationData {
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  logo: string | null;
  timezone: string;
  industry: string;
  size: string;
  founded: string;
  status: 'active' | 'trial' | 'suspended';
}

const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({ onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<OrganizationData>({
    name: 'Winbro Training Solutions',
    description: 'Leading provider of microlearning video solutions for manufacturing and industrial training.',
    website: 'https://winbro.com',
    email: 'contact@winbro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Industrial Blvd, Manufacturing City, MC 12345',
    logo: null,
    timezone: 'America/New_York',
    industry: 'Manufacturing Technology',
    size: '50-200 employees',
    founded: '2018',
    status: 'active'
  });

  const [originalData, setOriginalData] = useState<OrganizationData>(formData);

  const handleInputChange = (field: keyof OrganizationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange?.();
  };

  const handleSave = () => {
    setOriginalData(formData);
    setIsEditing(false);
    toast.success('Organization settings saved successfully');
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, logo: e.target?.result as string }));
        onChange?.();
      };
      reader.readAsDataURL(file);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'trial':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'suspended':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Organization Overview */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span>Organization Overview</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(formData.status)}>
                {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
              </Badge>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="hover:scale-105 transition-all duration-200"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="hover:bg-error/10 hover:border-error transition-all duration-200"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Section */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                {formData.logo ? (
                  <img
                    src={formData.logo}
                    alt="Organization logo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-medium">Organization Logo</Label>
              <p className="text-sm text-muted-foreground">
                Upload your organization's logo. Recommended size: 200x200px. Max file size: 5MB.
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  disabled={isUploading}
                  className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Logo'}
                </Button>
                {formData.logo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, logo: null }));
                      onChange?.();
                    }}
                    className="hover:bg-error/10 hover:border-error transition-all duration-200"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name *</Label>
              <Input
                id="org-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className="input-field"
                placeholder="Enter organization name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-industry">Industry</Label>
              <Input
                id="org-industry"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                disabled={!isEditing}
                className="input-field"
                placeholder="e.g., Manufacturing, Technology"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-size">Organization Size</Label>
              <Input
                id="org-size"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                disabled={!isEditing}
                className="input-field"
                placeholder="e.g., 50-200 employees"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-founded">Founded</Label>
              <Input
                id="org-founded"
                value={formData.founded}
                onChange={(e) => handleInputChange('founded', e.target.value)}
                disabled={!isEditing}
                className="input-field"
                placeholder="e.g., 2018"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-description">Description</Label>
            <Textarea
              id="org-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={!isEditing}
              className="input-field min-h-[100px]"
              placeholder="Describe your organization and its mission..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-primary" />
            <span>Contact Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="org-website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="org-website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  disabled={!isEditing}
                  className="input-field pl-10"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="org-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="input-field pl-10"
                  placeholder="contact@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="org-phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="input-field pl-10"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-timezone">Timezone</Label>
              <Input
                id="org-timezone"
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                disabled={!isEditing}
                className="input-field"
                placeholder="America/New_York"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="org-address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                className="input-field pl-10 min-h-[80px]"
                placeholder="Enter your organization's address..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Status */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>Organization Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "h-3 w-3 rounded-full",
                formData.status === 'active' && "bg-success",
                formData.status === 'trial' && "bg-secondary",
                formData.status === 'suspended' && "bg-error"
              )} />
              <div>
                <p className="font-medium">
                  {formData.status === 'active' && 'Organization is active and fully operational'}
                  {formData.status === 'trial' && 'Organization is in trial period'}
                  {formData.status === 'suspended' && 'Organization access is suspended'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formData.status === 'active' && 'All features and services are available'}
                  {formData.status === 'trial' && 'Limited features available during trial'}
                  {formData.status === 'suspended' && 'Contact support to restore access'}
                </p>
              </div>
            </div>
            {formData.status === 'trial' && (
              <Button size="sm" className="hover:scale-105 transition-all duration-200">
                Upgrade Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSettings;