import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { billingApi } from '@/lib/api';
import type { Coupon, BillingAddress } from '@/types/billing';

export interface CheckoutFormData {
  planId: string;
  billingAddress: BillingAddress;
  paymentMethod: {
    type: 'card';
    card: {
      number: string;
      expMonth: string;
      expYear: string;
      cvc: string;
    };
  };
  promoCode?: string;
  appliedCoupon?: Coupon;
  termsAccepted: boolean;
  marketingOptIn: boolean;
}

export const useCheckout = () => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    planId: '',
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    },
    paymentMethod: {
      type: 'card',
      card: {
        number: '',
        expMonth: '',
        expYear: '',
        cvc: ''
      }
    },
    termsAccepted: false,
    marketingOptIn: false
  });

  // Fetch subscription plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => billingApi.getSubscription(),
    select: (data) => data.plans || []
  });

  // Fetch current subscription
  const { data: currentSubscription } = useQuery({
    queryKey: ['current-subscription'],
    queryFn: () => billingApi.getSubscription()
  });

  // Apply promo code mutation
  const applyPromoMutation = useMutation({
    mutationFn: (code: string) => billingApi.applyCoupon(code),
    onSuccess: (data) => {
      toast.success('Promo code applied successfully!');
      setFormData(prev => ({ ...prev, appliedCoupon: data }));
    },
    onError: () => {
      toast.error('Invalid promo code');
    }
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: (data: any) => billingApi.updateSubscription(data.planId),
    onSuccess: () => {
      toast.success('Subscription created successfully!');
    },
    onError: () => {
      toast.error('Failed to create subscription');
    }
  });

  const updateFormData = (updates: Partial<CheckoutFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateBillingAddress = (updates: Partial<BillingAddress>) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, ...updates }
    }));
  };

  const updatePaymentMethod = (updates: Partial<CheckoutFormData['paymentMethod']>) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: { ...prev.paymentMethod, ...updates }
    }));
  };

  const updateCardDetails = (updates: Partial<CheckoutFormData['paymentMethod']['card']>) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: {
        ...prev.paymentMethod,
        card: { ...prev.paymentMethod.card, ...updates }
      }
    }));
  };

  const applyPromoCode = (code: string) => {
    if (code) {
      applyPromoMutation.mutate(code);
    }
  };

  const submitCheckout = () => {
    if (!formData.termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    createSubscriptionMutation.mutate(formData);
  };

  const selectedPlan = plans?.find((plan: any) => plan.id === formData.planId);

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    let total = selectedPlan.price;
    
    // Apply coupon discount if available
    if (formData.appliedCoupon) {
      if (formData.appliedCoupon.type === 'percentage') {
        total = total * (1 - formData.appliedCoupon.value / 100);
      } else {
        total = Math.max(0, total - formData.appliedCoupon.value);
      }
    }
    
    return total;
  };

  const isFormValid = () => {
    return (
      formData.planId &&
      formData.billingAddress.line1 &&
      formData.billingAddress.city &&
      formData.billingAddress.state &&
      formData.billingAddress.postal_code &&
      formData.paymentMethod.card.number &&
      formData.paymentMethod.card.expMonth &&
      formData.paymentMethod.card.expYear &&
      formData.paymentMethod.card.cvc &&
      formData.termsAccepted
    );
  };

  return {
    formData,
    plans,
    currentSubscription,
    selectedPlan,
    plansLoading,
    applyPromoMutation,
    createSubscriptionMutation,
    updateFormData,
    updateBillingAddress,
    updatePaymentMethod,
    updateCardDetails,
    applyPromoCode,
    submitCheckout,
    calculateTotal,
    isFormValid
  };
};