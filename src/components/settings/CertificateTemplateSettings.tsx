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
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Save, 
  X, 
  Palette,
  Type,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CertificateTemplateSettingsProps {
  onChange?: () => void;
}

interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  status: 'active' | 'draft' | 'archived';
  design: {
    backgroundColor: string;
    textColor: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: number;
    logo: string | null;
    watermark: string | null;
    borderStyle: 'none' | 'solid' | 'dashed' | 'double';
    borderColor: string;
    borderWidth: number;
  };
  content: {
    title: string;
    subtitle: string;
    recipientName: string;
    courseName: string;
    completionDate: string;
    certificateId: string;
    issuerName: string;
    issuerTitle: string;
    signature: string | null;
    additionalText: string;
  };
  layout: {
    orientation: 'portrait' | 'landscape';
    width: number;
    height: number;
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  validity: {
    expiresInDays: number | null;
    showExpiryDate: boolean;
    renewable: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

const CertificateTemplateSettings: React.FC<CertificateTemplateSettingsProps> = ({ onChange }) => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([
    {
      id: '1',
      name: 'Standard Certificate',
      description: 'Default certificate template for course completions',
      isDefault: true,
      status: 'active',
      design: {
        backgroundColor: '#FFFFFF',
        textColor: '#2F3A44',
        primaryColor: '#0B6B6F',
        secondaryColor: '#F3A712',
        fontFamily: 'Inter',
        fontSize: 14,
        logo: null,
        watermark: null,
        borderStyle: 'solid',
        borderColor: '#0B6B6F',
        borderWidth: 2
      },
      content: {
        title: 'Certificate of Completion',
        subtitle: 'This certifies that',
        recipientName: '[RECIPIENT_NAME]',
        courseName: '[COURSE_NAME]',
        completionDate: '[COMPLETION_DATE]',
        certificateId: '[CERTIFICATE_ID]',
        issuerName: 'Winbro Training Solutions',
        issuerTitle: 'Training Director',
        signature: null,
        additionalText: 'has successfully completed the required training program.'
      },
      layout: {
        orientation: 'landscape',
        width: 800,
        height: 600,
        margins: {
          top: 40,
          right: 40,
          bottom: 40,
          left: 40
        }
      },
      validity: {
        expiresInDays: 365,
        showExpiryDate: true,
        renewable: true
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-07T00:00:00Z'
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<string>('1');
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  const handleTemplateChange = (field: string, value: any) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === selectedTemplate 
          ? {
              ...template,
              [field]: value,
              updatedAt: new Date().toISOString()
            }
          : template
      )
    );
    onChange?.();
  };

  const handleDesignChange = (field: string, value: any) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === selectedTemplate 
          ? {
              ...template,
              design: {
                ...template.design,
                [field]: value
              },
              updatedAt: new Date().toISOString()
            }
          : template
      )
    );
    onChange?.();
  };

  const handleContentChange = (field: string, value: any) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === selectedTemplate 
          ? {
              ...template,
              content: {
                ...template.content,
                [field]: value
              },
              updatedAt: new Date().toISOString()
            }
          : template
      )
    );
    onChange?.();
  };


  const handleValidityChange = (field: string, value: any) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === selectedTemplate 
          ? {
              ...template,
              validity: {
                ...template.validity,
                [field]: value
              },
              updatedAt: new Date().toISOString()
            }
          : template
      )
    );
    onChange?.();
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Certificate template saved successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    onChange?.();
  };

  const handlePreview = () => {
    setIsPreviewing(true);
    // In a real app, this would open a preview modal or new tab
    setTimeout(() => {
      setIsPreviewing(false);
      toast.info('Preview opened in new tab');
    }, 1000);
  };

  const handleDownload = () => {
    toast.success('Certificate template downloaded');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'draft':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'archived':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Certificate Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-elevation-200",
                  selectedTemplate === template.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    <div className="flex items-center space-x-1">
                      {template.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                      <Badge className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Updated: {new Date(template.updatedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsEditing(true)}
              className="hover:scale-105 transition-all duration-200"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Template
            </Button>
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={isPreviewing}
              className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
            >
              <Eye className={cn("h-4 w-4 mr-2", isPreviewing && "animate-spin")} />
              {isPreviewing ? 'Opening...' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Template Editor */}
      {isEditing && (
        <Card className="shadow-elevation-100 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5 text-primary" />
                <span>Edit Template: {currentTemplate.name}</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  className="hover:scale-105 transition-all duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="hover:bg-error/10 hover:border-error transition-all duration-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Type className="h-5 w-5 text-primary" />
                <span>Basic Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={currentTemplate.name}
                    onChange={(e) => handleTemplateChange('name', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-status">Status</Label>
                  <select
                    id="template-status"
                    value={currentTemplate.status}
                    onChange={(e) => handleTemplateChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={currentTemplate.description}
                  onChange={(e) => handleTemplateChange('description', e.target.value)}
                  className="input-field min-h-[80px]"
                />
              </div>
            </div>

            <Separator />

            {/* Design Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Palette className="h-5 w-5 text-primary" />
                <span>Design Settings</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={currentTemplate.design.backgroundColor}
                      onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
                      className="w-16 h-10 p-1 border border-input rounded"
                    />
                    <Input
                      value={currentTemplate.design.backgroundColor}
                      onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
                      className="input-field flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="text-color"
                      type="color"
                      value={currentTemplate.design.textColor}
                      onChange={(e) => handleDesignChange('textColor', e.target.value)}
                      className="w-16 h-10 p-1 border border-input rounded"
                    />
                    <Input
                      value={currentTemplate.design.textColor}
                      onChange={(e) => handleDesignChange('textColor', e.target.value)}
                      className="input-field flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={currentTemplate.design.primaryColor}
                      onChange={(e) => handleDesignChange('primaryColor', e.target.value)}
                      className="w-16 h-10 p-1 border border-input rounded"
                    />
                    <Input
                      value={currentTemplate.design.primaryColor}
                      onChange={(e) => handleDesignChange('primaryColor', e.target.value)}
                      className="input-field flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-family">Font Family</Label>
                  <select
                    id="font-family"
                    value={currentTemplate.design.fontFamily}
                    onChange={(e) => handleDesignChange('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size (px)</Label>
                  <Input
                    id="font-size"
                    type="number"
                    value={currentTemplate.design.fontSize}
                    onChange={(e) => handleDesignChange('fontSize', parseInt(e.target.value) || 14)}
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="border-style">Border Style</Label>
                  <select
                    id="border-style"
                    value={currentTemplate.design.borderStyle}
                    onChange={(e) => handleDesignChange('borderStyle', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="double">Double</option>
                  </select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Content Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Type className="h-5 w-5 text-primary" />
                <span>Content Settings</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cert-title">Certificate Title</Label>
                  <Input
                    id="cert-title"
                    value={currentTemplate.content.title}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cert-subtitle">Subtitle</Label>
                  <Input
                    id="cert-subtitle"
                    value={currentTemplate.content.subtitle}
                    onChange={(e) => handleContentChange('subtitle', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuer-name">Issuer Name</Label>
                  <Input
                    id="issuer-name"
                    value={currentTemplate.content.issuerName}
                    onChange={(e) => handleContentChange('issuerName', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuer-title">Issuer Title</Label>
                  <Input
                    id="issuer-title"
                    value={currentTemplate.content.issuerTitle}
                    onChange={(e) => handleContentChange('issuerTitle', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-text">Additional Text</Label>
                <Textarea
                  id="additional-text"
                  value={currentTemplate.content.additionalText}
                  onChange={(e) => handleContentChange('additionalText', e.target.value)}
                  className="input-field min-h-[80px]"
                  placeholder="Additional text to include on the certificate..."
                />
              </div>
            </div>

            <Separator />

            {/* Validity Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Validity Settings</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expires-days">Expires in (days)</Label>
                  <Input
                    id="expires-days"
                    type="number"
                    value={currentTemplate.validity.expiresInDays || ''}
                    onChange={(e) => handleValidityChange('expiresInDays', parseInt(e.target.value) || null)}
                    className="input-field"
                    placeholder="Leave empty for no expiry"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={currentTemplate.validity.showExpiryDate}
                      onCheckedChange={(checked) => handleValidityChange('showExpiryDate', checked)}
                    />
                    <Label className="text-sm font-medium">Show expiry date on certificate</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={currentTemplate.validity.renewable}
                      onCheckedChange={(checked) => handleValidityChange('renewable', checked)}
                    />
                    <Label className="text-sm font-medium">Certificate is renewable</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Preview */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-primary" />
            <span>Template Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 bg-muted/20">
            <div 
              className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
              style={{
                width: `${currentTemplate.layout.width * 0.5}px`,
                height: `${currentTemplate.layout.height * 0.5}px`,
                backgroundColor: currentTemplate.design.backgroundColor,
                color: currentTemplate.design.textColor,
                fontFamily: currentTemplate.design.fontFamily,
                fontSize: `${currentTemplate.design.fontSize * 0.5}px`,
                border: currentTemplate.design.borderStyle !== 'none' 
                  ? `${currentTemplate.design.borderWidth}px ${currentTemplate.design.borderStyle} ${currentTemplate.design.borderColor}`
                  : 'none'
              }}
            >
              <div className="p-8 text-center h-full flex flex-col justify-center">
                <h1 
                  className="text-2xl font-bold mb-4"
                  style={{ color: currentTemplate.design.primaryColor }}
                >
                  {currentTemplate.content.title}
                </h1>
                <p className="text-lg mb-6">{currentTemplate.content.subtitle}</p>
                <div className="mb-6">
                  <p className="text-lg font-semibold">John Doe</p>
                  <p className="text-sm text-muted-foreground">{currentTemplate.content.additionalText}</p>
                  <p className="text-lg font-semibold mt-2">Safety Training Course</p>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between items-end">
                    <div className="text-left">
                      <p className="font-semibold">{currentTemplate.content.issuerName}</p>
                      <p className="text-sm text-muted-foreground">{currentTemplate.content.issuerTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">ID: CERT-123456</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateTemplateSettings;