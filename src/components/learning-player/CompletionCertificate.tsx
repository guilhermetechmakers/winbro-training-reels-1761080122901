import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Facebook,
  Star,
  Trophy,
  Target,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCelebration] = useState(true);

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
        setShowShareModal(true);
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
    <>
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-6xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10,
                  delay: 0.2
                }}
              >
                🎉
              </motion.div>
            </div>
            <div className="absolute top-1/4 left-1/4">
              <motion.div
                className="text-4xl"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10,
                  delay: 0.4
                }}
              >
                🏆
              </motion.div>
            </div>
            <div className="absolute top-1/3 right-1/4">
              <motion.div
                className="text-5xl"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10,
                  delay: 0.6
                }}
              >
                ⭐
              </motion.div>
            </div>
            <div className="absolute bottom-1/4 left-1/3">
              <motion.div
                className="text-4xl"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10,
                  delay: 0.8
                }}
              >
                🎊
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className={`overflow-hidden shadow-2xl ${className}`}>
        <CardHeader className="bg-gradient-to-r from-success/20 via-primary/10 to-success/20 border-b">
          <CardTitle className="flex items-center gap-3 text-success text-xl">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            Course Completion Certificate
          </CardTitle>
        </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Enhanced Certificate Preview */}
          <motion.div
            className="relative bg-gradient-to-br from-white via-gray-50 to-white border-2 border-success/30 rounded-xl p-8 text-center shadow-lg"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            {/* Decorative Border */}
            <div className="absolute inset-4 border border-success/20 rounded-lg"></div>
            <div className="absolute inset-6 border border-success/10 rounded-lg"></div>
            
            {/* Certificate Design */}
            <div className="space-y-6 relative z-10">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-success/20 to-success/30 rounded-full flex items-center justify-center mx-auto shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <Trophy className="h-10 w-10 text-success" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                  Certificate of Completion
                </h2>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <p className="text-muted-foreground text-lg">This certifies that</p>
                
                <h3 className="text-4xl font-bold text-primary bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                  {userName}
                </h3>
                
                <p className="text-muted-foreground text-lg">has successfully completed</p>
                
                <h4 className="text-2xl font-semibold text-foreground">{courseTitle}</h4>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <span className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full">
                  <Calendar className="h-4 w-4" />
                  {formatDate(certificate.completion_date)}
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full text-success">
                  <CheckCircle className="h-4 w-4" />
                  {certificate.percentage}% Score
                </span>
              </motion.div>
              
              <motion.div 
                className="pt-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
              >
                <Badge variant="outline" className="text-sm px-4 py-2 bg-primary/5 border-primary/20">
                  Certificate #{certificate.certificate_number}
                </Badge>
              </motion.div>
            </div>
            
            {/* Enhanced QR Code */}
            <div className="absolute top-6 right-6">
              <div className="w-20 h-20 bg-white rounded-lg border-2 border-success/20 flex items-center justify-center shadow-md">
                <QrCode className="h-10 w-10 text-success" />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-6 left-6">
              <Sparkles className="h-6 w-6 text-success/30" />
            </div>
            <div className="absolute bottom-6 right-6">
              <Star className="h-6 w-6 text-primary/30" />
            </div>
            <div className="absolute bottom-6 left-6">
              <Target className="h-6 w-6 text-success/30" />
            </div>
          </motion.div>

          {/* Enhanced Certificate Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div 
              className="space-y-4 p-4 bg-muted/30 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                Certificate Details
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-card rounded-lg">
                  <span className="text-muted-foreground">Certificate Number:</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{certificate.certificate_number}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded-lg">
                  <span className="text-muted-foreground">Issued Date:</span>
                  <span className="font-medium">{formatDate(certificate.issued_at)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded-lg">
                  <span className="text-muted-foreground">Completion Score:</span>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    {certificate.percentage}%
                  </Badge>
                </div>
                {certificate.expires_at && (
                  <div className="flex justify-between items-center p-2 bg-card rounded-lg">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-medium">{formatDate(certificate.expires_at)}</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="space-y-4 p-4 bg-muted/30 rounded-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-success" />
                </div>
                Course Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-card rounded-lg">
                  <span className="text-muted-foreground">Course:</span>
                  <span className="text-right font-medium">{courseTitle}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded-lg">
                  <span className="text-muted-foreground">Organization:</span>
                  <span className="font-medium">{certificate.organization_name || 'Winbro Training'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-card rounded-lg">
                  <span className="text-muted-foreground">Verification:</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                    onClick={onVerify}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Verify Online
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          <Separator />

          {/* Enhanced Action Buttons */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button 
                  onClick={handleDownload}
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button 
                  variant="outline" 
                  onClick={handleShare}
                  disabled={isSharing}
                  size="lg"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Share className="h-5 w-5 mr-2" />
                  {isSharing ? 'Sharing...' : 'Share Certificate'}
                </Button>
              </motion.div>
            </div>

            {/* Enhanced Share Options */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Share on:</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSocialShare('twitter')}
                      className="hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSocialShare('linkedin')}
                      className="hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSocialShare('facebook')}
                      className="hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSocialShare('mail')}
                      className="hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Verification Info */}
            <motion.div 
              className="p-6 bg-gradient-to-r from-info/5 to-primary/5 rounded-xl border border-info/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-info/20 rounded-lg flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 text-info" />
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-lg font-semibold text-foreground">
                    Verify this certificate
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This certificate can be verified online using the certificate number or QR code. 
                    Employers and institutions can verify the authenticity of this certificate.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-info hover:text-info/80 font-medium"
                    onClick={onVerify}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Verify Certificate Online →
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Share Modal */}
    <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share Certificate
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose how you'd like to share your certificate:
          </p>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link to Clipboard
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSocialShare('linkedin')}
                className="flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSocialShare('facebook')}
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSocialShare('mail')}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default CompletionCertificate;
