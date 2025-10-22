import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Download, 
  ExternalLink, 
  Calendar, 
  Users, 
  HardDrive,
  CheckCircle,
  Building2,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BillingSettingsProps {
  onChange?: () => void;
}

interface Subscription {
  id: string;
  plan: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'trial' | 'past_due' | 'canceled';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  seats: number;
  usedSeats: number;
  storage: number; // in GB
  usedStorage: number; // in GB
  monthlyPrice: number;
  annualPrice: number;
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

const BillingSettings: React.FC<BillingSettingsProps> = ({ onChange }) => {
  const [subscription, setSubscription] = useState<Subscription>({
    id: 'sub_1234567890',
    plan: 'professional',
    status: 'active',
    currentPeriodStart: '2024-01-01T00:00:00Z',
    currentPeriodEnd: '2024-02-01T00:00:00Z',
    cancelAtPeriodEnd: false,
    seats: 50,
    usedSeats: 32,
    storage: 1000,
    usedStorage: 245.6,
    monthlyPrice: 99,
    annualPrice: 990,
    billingCycle: 'monthly',
    nextBillingDate: '2024-02-01T00:00:00Z'
  });

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1234567890',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expMonth: 12,
      expYear: 2025,
      isDefault: true
    },
    {
      id: 'pm_0987654321',
      type: 'card',
      last4: '5555',
      brand: 'mastercard',
      expMonth: 8,
      expYear: 2026,
      isDefault: false
    }
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: 'inv_1234567890',
      number: 'INV-2024-001',
      date: '2024-01-01T00:00:00Z',
      amount: 99.00,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'inv_1234567891',
      number: 'INV-2023-012',
      date: '2023-12-01T00:00:00Z',
      amount: 99.00,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'inv_1234567892',
      number: 'INV-2023-011',
      date: '2023-11-01T00:00:00Z',
      amount: 99.00,
      status: 'paid',
      downloadUrl: '#'
    }
  ]);

  const [billingInfo, setBillingInfo] = useState({
    companyName: 'Winbro Training Solutions',
    email: 'billing@winbro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Industrial Blvd, Manufacturing City, MC 12345',
    taxId: '12-3456789',
    vatNumber: 'VAT123456789'
  });

  const handleUpdateSeats = () => {
    const newSeats = prompt('Enter new number of seats:', subscription.seats.toString());
    if (newSeats && !isNaN(parseInt(newSeats))) {
      setSubscription(prev => ({ ...prev, seats: parseInt(newSeats) }));
      onChange?.();
      toast.success('Seat count updated successfully');
    }
  };

  const handleChangePlan = (newPlan: string) => {
    setSubscription(prev => ({ ...prev, plan: newPlan as any }));
    onChange?.();
    toast.success('Plan changed successfully');
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your current billing period.')) {
      setSubscription(prev => ({ ...prev, cancelAtPeriodEnd: true }));
      onChange?.();
      toast.success('Subscription will be canceled at the end of the current period');
    }
  };

  const handleReactivateSubscription = () => {
    setSubscription(prev => ({ ...prev, cancelAtPeriodEnd: false }));
    onChange?.();
    toast.success('Subscription reactivated successfully');
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      toast.success('Invoice download started');
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      case 'professional':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'enterprise':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'trial':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'past_due':
        return 'bg-error/10 text-error border-error/20';
      case 'canceled':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'failed':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getUsagePercentage = (used: number, total: number) => {
    return Math.min((used / total) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 75) return 'text-secondary';
    return 'text-success';
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>Current Subscription</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge className={getPlanColor(subscription.plan)}>
                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
              </Badge>
              <Badge className={getStatusColor(subscription.status)}>
                {subscription.status.replace('_', ' ').toUpperCase()}
              </Badge>
              {subscription.cancelAtPeriodEnd && (
                <Badge variant="destructive">Canceling at period end</Badge>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {formatCurrency(subscription.billingCycle === 'monthly' ? subscription.monthlyPrice : subscription.annualPrice / 12)}
              </div>
              <div className="text-sm text-muted-foreground">
                per {subscription.billingCycle === 'monthly' ? 'month' : 'year'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Usage</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Seats</span>
                    <span>{subscription.usedSeats} / {subscription.seats}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        getUsageColor(getUsagePercentage(subscription.usedSeats, subscription.seats)) === 'text-error' && "bg-error",
                        getUsageColor(getUsagePercentage(subscription.usedSeats, subscription.seats)) === 'text-secondary' && "bg-secondary",
                        getUsageColor(getUsagePercentage(subscription.usedSeats, subscription.seats)) === 'text-success' && "bg-success"
                      )}
                      style={{ width: `${getUsagePercentage(subscription.usedSeats, subscription.seats)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Storage</span>
                    <span>{subscription.usedStorage.toFixed(1)} GB / {subscription.storage} GB</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        getUsageColor(getUsagePercentage(subscription.usedStorage, subscription.storage)) === 'text-error' && "bg-error",
                        getUsageColor(getUsagePercentage(subscription.usedStorage, subscription.storage)) === 'text-secondary' && "bg-secondary",
                        getUsageColor(getUsagePercentage(subscription.usedStorage, subscription.storage)) === 'text-success' && "bg-success"
                      )}
                      style={{ width: `${getUsagePercentage(subscription.usedStorage, subscription.storage)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Billing Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Billing cycle: {subscription.billingCycle}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Seat limit: {subscription.seats}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span>Storage limit: {subscription.storage} GB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={handleUpdateSeats}
              className="hover:scale-105 transition-all duration-200"
            >
              <Users className="h-4 w-4 mr-2" />
              Update Seats
            </Button>
            <Button
              variant="outline"
              onClick={() => handleChangePlan('enterprise')}
              className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
            >
              Upgrade Plan
            </Button>
            {subscription.cancelAtPeriodEnd ? (
              <Button
                variant="outline"
                onClick={handleReactivateSubscription}
                className="hover:bg-success/10 hover:border-success transition-all duration-200"
              >
                Reactivate
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleCancelSubscription}
                className="hover:bg-error/10 hover:border-error transition-all duration-200"
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>Payment Methods</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="hover:shadow-elevation-200 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-6 bg-primary rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                      </p>
                    </div>
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-error/10 hover:border-error transition-all duration-200"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full hover:bg-primary/10 hover:border-primary transition-all duration-200"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Billing Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={billingInfo.companyName}
                onChange={(e) => setBillingInfo(prev => ({ ...prev, companyName: e.target.value }))}
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing-email">Billing Email</Label>
              <Input
                id="billing-email"
                type="email"
                value={billingInfo.email}
                onChange={(e) => setBillingInfo(prev => ({ ...prev, email: e.target.value }))}
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing-phone">Phone</Label>
              <Input
                id="billing-phone"
                value={billingInfo.phone}
                onChange={(e) => setBillingInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-id">Tax ID</Label>
              <Input
                id="tax-id"
                value={billingInfo.taxId}
                onChange={(e) => setBillingInfo(prev => ({ ...prev, taxId: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billing-address">Billing Address</Label>
            <Input
              id="billing-address"
              value={billingInfo.address}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, address: e.target.value }))}
              className="input-field"
            />
          </div>

          <Button
            onClick={() => {
              onChange?.();
              toast.success('Billing information updated successfully');
            }}
            className="hover:scale-105 transition-all duration-200"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Update Billing Information
          </Button>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Recent Invoices</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-elevation-200 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{invoice.number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getInvoiceStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full hover:bg-primary/10 hover:border-primary transition-all duration-200"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Invoices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSettings;