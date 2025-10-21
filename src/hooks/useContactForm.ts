import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { ContactFormData, ContactFormState, UseContactFormReturn } from '@/types/help';

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  category: 'general',
  priority: 'medium',
  attachments: []
};

const initialFormState: ContactFormState = {
  data: initialFormData,
  errors: {},
  isSubmitting: false,
  isValid: false,
  isDirty: false
};

export const useContactForm = (): UseContactFormReturn => {
  const [formState, setFormState] = useState<ContactFormState>(initialFormState);

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    
    // Name validation
    if (!formState.data.name.trim()) {
      errors.name = 'Name is required';
    } else if (formState.data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formState.data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Subject validation
    if (!formState.data.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (formState.data.subject.trim().length < 5) {
      errors.subject = 'Subject must be at least 5 characters';
    }
    
    // Message validation
    if (!formState.data.message.trim()) {
      errors.message = 'Message is required';
    } else if (formState.data.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    const isValid = Object.keys(errors).length === 0;
    
    setFormState(prev => ({
      ...prev,
      errors,
      isValid
    }));
    
    return isValid;
  }, [formState.data]);

  const updateField = useCallback((field: keyof ContactFormData, value: any) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value
      },
      isDirty: true,
      errors: {
        ...prev.errors,
        [field]: '' // Clear error when user starts typing
      }
    }));
  }, []);

  const submit = useCallback(async (): Promise<void> => {
    if (!validate()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setFormState(prev => ({
      ...prev,
      isSubmitting: true
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make the actual API call
      // const response = await api.submitContactForm(formState.data);
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      
      // Reset form after successful submission
      setFormState(initialFormState);
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
      
      setFormState(prev => ({
        ...prev,
        isSubmitting: false
      }));
    }
  }, [formState.data, validate]);

  const reset = useCallback(() => {
    setFormState(initialFormState);
  }, []);

  return {
    formState,
    updateField,
    submit,
    reset,
    validate
  };
};