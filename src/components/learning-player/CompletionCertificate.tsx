import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Share, 
  ExternalLink, 
  Award, 
  CheckCircle, 
  Calendar,
  User,
  BookOpen,
  QrCode,
  Copy,
  Mail,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { CertificateResult } from '@/types/content';

interface CompletionCertificateProps {
  certificate: CertificateResult;
  courseTitle: string;
  userName: string;
  onDownload: () => void;
  onShare: () => void;
  onVerify: () => void;
  className?: string;
}

const CompletionCertificate: React.FC<CompletionCertificateProps> = ({
  certificate,
  courseTitle,
  userName,
  onDownload,
  onShare,
  onVerify,
  className = ''
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleDownload = () => {
    try {
      // Simulate PDF download
      const link = document.createElement('a');
      link.href = certificate.pdf_url;
      link.download = `${courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`;
      link.click();
      
      toast.success('Certificate downloaded successfully!');
      onDownload();
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${courseTitle} - Certificate of Completion`,
          text: `I just completed the ${courseTitle} course and earned a certificate!`,
          url: certificate.share_url
        });
        toast.success('Certificate shared successfully!');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(certificate.share_url);
        toast.success('Certificate link copied to clipboard!');
      }
      onShare();
    } catch (error) {
      toast.error('Failed to share certificate');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(certificate.share_url);
      toast.success('Certificate link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(certificate.share_url);
    const title = encodeURIComponent(`${courseTitle} - Certificate of Completion`);
    const text = encodeURIComponent(`I just completed the ${courseTitle} course and earned a certificate!`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'mail':
        shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-success/10 to-primary/10 border-b">
        <CardTitle className="flex items-center gap-2 text-success">
          <Award className="h-6 w-6" />
          Course Completion Certificate
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Certificate Preview */}
          <motion.div
            className="relative bg-gradient-to-br from-white to-gray-50 border-2 border-success/20 rounded-lg p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Certificate Design */}
            <div className="space-y-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-success" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground">Certificate of Completion</h2>
              
              <p className="text-muted-foreground">This certifies that</p>
              
              <h3 className="text-3xl font-bold text-primary">{userName}</h3>
              
              <p className="text-muted-foreground">has successfully completed</p>
              
              <h4 className="text-xl font-semibold text-foreground">{courseTitle}</h4>
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(certificate.completion_date)}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {certificate.percentage}% Score
                </span>
              </div>
              
              <div className="pt-4">
                <Badge variant="outline" className="text-xs">
                  Certificate #{certificate.certificate_number}
                </Badge>
              </div>
            </div>
            
            {/* QR Code Placeholder */}
            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 bg-muted rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <QrCode className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </div>
          </motion.div>

          {/* Certificate Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Certificate Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificate Number:</span>
                  <span className="font-mono text-xs">{certificate.certificate_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issued Date:</span>
                  <span>{formatDate(certificate.issued_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion Score:</span>
                  <span className="font-semibold text-success">{certificate.percentage}%</span>
                </div>
                {certificate.expires_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span>{formatDate(certificate.expires_at)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course:</span>
                  <span className="text-right">{courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organization:</span>
                  <span>{certificate.organization_name || 'Winbro Training'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verification:</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={onVerify}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Verify Online
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleDownload}
                className="flex-1"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleShare}
                disabled={isSharing}
                className="flex-1"
                size="lg"
              >
                <Share className="h-4 w-4 mr-2" />
                {isSharing ? 'Sharing...' : 'Share Certificate'}
              </Button>
            </div>

            {/* Share Options */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSocialShare('twitter')}
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSocialShare('linkedin')}
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSocialShare('facebook')}
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSocialShare('mail')}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Verification Info */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Verify this certificate
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This certificate can be verified online using the certificate number or QR code.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={onVerify}
                  >
                    Verify Certificate →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionCertificate;
