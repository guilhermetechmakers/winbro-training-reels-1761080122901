import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Share2, ArrowRight, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CheckoutConfirmationProps {
  subscription: {
    id: string;
    plan: {
      name: string;
      price: number;
      interval: string;
    };
    status: string;
    current_period_start: string;
    current_period_end: string;
  };
  onContinue: () => void;
}

const CheckoutConfirmation: React.FC<CheckoutConfirmationProps> = ({
  subscription,
  onContinue
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Success Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle className="h-8 w-8 text-success" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Successful!</h1>
          <p className="text-muted-foreground mt-2">
            Your subscription has been activated and you're all set to start using Winbro Training Reels.
          </p>
        </div>
      </div>

      {/* Subscription Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Subscription Details</span>
            <Badge variant="secondary" className="bg-success/10 text-success">
              Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Plan</h4>
              <p className="text-muted-foreground">{subscription.plan.name}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Price</h4>
              <p className="text-muted-foreground">
                ${(subscription.plan.price / 100).toFixed(2)}/{subscription.plan.interval}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Billing Period</h4>
              <p className="text-muted-foreground">
                {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Next Billing Date</h4>
              <p className="text-muted-foreground">
                {formatDate(subscription.current_period_end)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
          <CardDescription>
            Here's what you can do now that your subscription is active
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">1</span>
              </div>
              <div>
                <h4 className="font-medium">Explore Your Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  Access your personalized dashboard to start managing your training content
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">2</span>
              </div>
              <div>
                <h4 className="font-medium">Upload Your First Clip</h4>
                <p className="text-sm text-muted-foreground">
                  Start by uploading training videos and building your content library
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <div>
                <h4 className="font-medium">Invite Your Team</h4>
                <p className="text-sm text-muted-foreground">
                  Add team members and assign roles to start collaborating
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Download className="h-8 w-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium">Download Invoice</h4>
            <p className="text-sm text-muted-foreground">Get your receipt</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Share2 className="h-8 w-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium">Share Access</h4>
            <p className="text-sm text-muted-foreground">Invite team members</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium">Schedule Demo</h4>
            <p className="text-sm text-muted-foreground">Get personalized help</p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <div className="text-center pt-6">
        <Button size="lg" onClick={onContinue} className="min-w-[200px]">
          Go to Dashboard
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Support */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h4 className="font-medium">Need Help Getting Started?</h4>
            <p className="text-sm text-muted-foreground">
              Our support team is here to help you make the most of your subscription
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
              <Button variant="outline" size="sm">
                View Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CheckoutConfirmation;