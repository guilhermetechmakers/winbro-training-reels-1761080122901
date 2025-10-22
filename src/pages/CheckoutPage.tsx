import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CheckoutConfirmation from '@/components/checkout/CheckoutConfirmation';

// Hooks
import { useCheckout } from '@/hooks/useCheckout';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSubscription, setCompletedSubscription] = useState<any>(null);
  
  const {
    formData,
    plans,
    selectedPlan,
    plansLoading,
    applyPromoMutation,
    createSubscriptionMutation,
    updateFormData,
    updateBillingAddress,
    updateCardDetails,
    applyPromoCode,
    calculateTotal,
    isFormValid
  } = useCheckout();

  const steps = [
    { id: 1, title: 'Select Plan', description: 'Choose your subscription plan' },
    { id: 2, title: 'Billing Details', description: 'Enter your billing information' },
    { id: 3, title: 'Payment', description: 'Complete your payment' },
    { id: 4, title: 'Confirmation', description: 'Review and confirm' }
  ];

  const handleContinueToDashboard = () => {
    navigate('/dashboard');
  };

  const handlePlanSelect = (planId: string) => {
    updateFormData({ planId });
    setCurrentStep(2);
  };

  const handlePromoCodeApply = () => {
    if (formData.promoCode) {
      applyPromoCode(formData.promoCode);
    }
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      return;
    }
    createSubscriptionMutation.mutate(formData, {
      onSuccess: (data) => {
        setCompletedSubscription(data);
        setCurrentStep(4);
      }
    });
  };


  if (plansLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
                <p className="text-muted-foreground">Complete your subscription</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        currentStep >= step.id 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : 'border-muted-foreground text-muted-foreground'
                      }`}>
                        {currentStep > step.id ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-4 ${
                          currentStep > step.id ? 'bg-primary' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <Progress value={(currentStep / steps.length) * 100} className="h-2" />
              </CardContent>
            </Card>

            {/* Step 1: Plan Selection */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Your Plan</CardTitle>
                    <CardDescription>
                      Select the plan that best fits your organization's needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plans?.map((plan: any) => (
                      <motion.div
                        key={plan.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all ${
                            formData.planId === plan.id 
                              ? 'ring-2 ring-primary border-primary' 
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => handlePlanSelect(plan.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                                  {plan.is_popular && (
                                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                                      Most Popular
                                    </Badge>
                                  )}
                                  {plan.is_enterprise && (
                                    <Badge variant="outline">Enterprise</Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground">{plan.description}</p>
                                <div className="flex items-baseline space-x-1">
                                  <span className="text-3xl font-bold">
                                    ${(plan.price / 100).toFixed(0)}
                                  </span>
                                  <span className="text-muted-foreground">
                                    /{plan.interval}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                                  {formData.planId === plan.id && (
                                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                                  )}
                                </div>
                              </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                              <h4 className="font-medium">Features included:</h4>
                              <ul className="space-y-1">
                                {plan.features.slice(0, 4).map((feature: any) => (
                                  <li key={feature.id} className="flex items-center space-x-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                                    <span>{feature.name}</span>
                                  </li>
                                ))}
                                {plan.features.length > 4 && (
                                  <li className="text-sm text-muted-foreground">
                                    +{plan.features.length - 4} more features
                                  </li>
                                )}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Billing Details */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>
                      Enter your billing address and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="line1">Address Line 1 *</Label>
                        <Input
                          id="line1"
                          value={formData.billingAddress.line1}
                          onChange={(e) => updateBillingAddress({ line1: e.target.value })}
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="line2">Address Line 2</Label>
                        <Input
                          id="line2"
                          value={formData.billingAddress.line2}
                          onChange={(e) => updateBillingAddress({ line2: e.target.value })}
                          placeholder="Apt, suite, etc."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.billingAddress.city}
                          onChange={(e) => updateBillingAddress({ city: e.target.value })}
                          placeholder="New York"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.billingAddress.state}
                          onChange={(e) => updateBillingAddress({ state: e.target.value })}
                          placeholder="NY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postal_code">ZIP Code *</Label>
                        <Input
                          id="postal_code"
                          value={formData.billingAddress.postal_code}
                          onChange={(e) => updateBillingAddress({ postal_code: e.target.value })}
                          placeholder="10001"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        value={formData.billingAddress.country}
                        onValueChange={(value) => updateBillingAddress({ country: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => setCurrentStep(3)}>
                        Continue to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>
                      Enter your payment details to complete the subscription
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label htmlFor="card-number">Card Number *</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="card-number"
                          className="pl-10"
                          placeholder="1234 5678 9012 3456"
                          value={formData.paymentMethod.card.number}
                          onChange={(e) => updateCardDetails({ number: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="exp-month">Expiry Month *</Label>
                        <Select
                          value={formData.paymentMethod.card.expMonth}
                          onValueChange={(value) => updateCardDetails({ expMonth: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                {(i + 1).toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exp-year">Expiry Year *</Label>
                        <Select
                          value={formData.paymentMethod.card.expYear}
                          onValueChange={(value) => updateCardDetails({ expYear: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC *</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={formData.paymentMethod.card.cvc}
                        onChange={(e) => updateCardDetails({ cvc: e.target.value })}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => updateFormData({ termsAccepted: checked as boolean })}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{' '}
                          <a href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="marketing"
                          checked={formData.marketingOptIn}
                          onCheckedChange={(checked) => updateFormData({ marketingOptIn: checked as boolean })}
                        />
                        <Label htmlFor="marketing" className="text-sm">
                          Send me product updates and marketing communications
                        </Label>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(2)}>
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        disabled={!formData.termsAccepted || createSubscriptionMutation.isPending}
                      >
                        {createSubscriptionMutation.isPending ? 'Processing...' : 'Complete Payment'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && completedSubscription && (
              <CheckoutConfirmation
                subscription={completedSubscription}
                onContinue={handleContinueToDashboard}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlan && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{selectedPlan.name}</span>
                      <span className="font-semibold">
                        ${(selectedPlan.price / 100).toFixed(0)}/{selectedPlan.interval}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                  </div>
                )}
                
                <Separator />
                
                {/* Promo Code */}
                <div className="space-y-2">
                  <Label htmlFor="promo-code">Promo Code</Label>
                  <div className="flex space-x-2">
                      <Input
                        id="promo-code"
                        placeholder="Enter code"
                        value={formData.promoCode || ''}
                        onChange={(e) => updateFormData({ promoCode: e.target.value })}
                      />
                    <Button 
                      variant="outline" 
                      onClick={handlePromoCodeApply}
                      disabled={applyPromoMutation.isPending}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${selectedPlan ? (selectedPlan.price / 100).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span>
                      {formData.appliedCoupon 
                        ? formData.appliedCoupon.type === 'percentage'
                          ? `-${formData.appliedCoupon.value}%`
                          : `-$${(formData.appliedCoupon.value / 100).toFixed(2)}`
                        : '$0.00'
                      }
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(calculateTotal() / 100).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Secure Payment</h4>
                    <p className="text-xs text-muted-foreground">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Need Help?</h4>
                  <p className="text-xs text-muted-foreground">
                    Contact our support team for assistance with your subscription.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;