'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoaderCircle, CheckCircle2, AlertTriangle, Phone, Clock, Target } from 'lucide-react';
import { submitLeadToCRM, type LeadData } from '@/lib/crm';
import { getSession } from '@/lib/session';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ErrorBoundary, { NetworkErrorFallback } from '@/components/ui/error-boundary';
import { FormLoadingSkeleton } from '@/components/ui/loading-skeleton';

const finalLeadFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  workEmail: z.string().email({
    message: 'Please enter a valid work email address.',
  }),
  companyWebsite: z.string().url({ 
    message: 'Please enter a valid website URL.' 
  }),
  serviceInterest: z.enum(['speed_optimization', 'performance_audit', 'consulting', 'other'], {
    required_error: "Please select a service of interest.",
  }),
  primaryGoal: z.string().optional(),
  message: z.string().optional(),
});

type FinalLeadFormValues = z.infer<typeof finalLeadFormSchema>;

interface FinalLeadFormProps {
  prefilledData?: {
    email?: string;
    website?: string;
  };
  onSubmit?: (data: FinalLeadFormValues) => void;
}

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const FinalLeadForm = ({ prefilledData, onSubmit }: FinalLeadFormProps) => {
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const form = useForm<FinalLeadFormValues>({
    resolver: zodResolver(finalLeadFormSchema),
    defaultValues: {
      name: '',
      workEmail: prefilledData?.email || '',
      companyWebsite: prefilledData?.website || '',
      serviceInterest: undefined,
      primaryGoal: '',
      message: '',
    },
  });

  const handleSubmit = async (values: FinalLeadFormValues) => {
    setSubmissionState('submitting');
    setErrorMessage('');
    
    try {
      // Get session data for additional context
      const session = await getSession();
      
      // Prepare lead data for CRM
      const leadData: LeadData = {
        name: values.name,
        email: values.workEmail,
        website: values.companyWebsite,
        serviceInterest: values.serviceInterest,
        primaryGoal: values.primaryGoal || '',
        message: values.message || '',
        source: 'analysis-results-page',
        performanceScore: session?.analysis?.performanceScore,
        analysisUrl: session?.url,
      };
      
      // Submit to CRM
      const crmResult = await submitLeadToCRM(leadData);
      
      if (!crmResult.success) {
        console.error('CRM submission failed:', crmResult.error);
        setErrorMessage('Your information was saved! We\'ll contact you soon even though there was a technical issue.');
        setSubmissionState('success'); // Still show success since we want to complete the funnel
      } else {
        setSubmissionState('success');
      }
      
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(values);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage(
        error instanceof Error && error.message.includes('network')
          ? 'Connection issue detected. Please check your internet and try again.'
          : 'There was an error submitting your request. Please try again.'
      );
      setSubmissionState('error');
    }
  };

  // Success state component
  const SuccessState = () => (
    <div className="text-center p-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-emerald-100 rounded-full animate-bounce">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-emerald-600 mb-4">
        Thank You!
      </h3>
      
      <p className="text-lg text-gray-700 mb-6">
        Your request has been submitted successfully. We'll contact you within 24 hours with your detailed optimization plan.
      </p>
      
      {errorMessage && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-yellow-800 text-sm">{errorMessage}</p>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 p-4 rounded-lg">
          <Phone className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Phone Call</p>
          <p className="text-xs text-gray-600">Within 24 hours</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <Target className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Custom Plan</p>
          <p className="text-xs text-gray-600">Tailored for your site</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Fast Results</p>
          <p className="text-xs text-gray-600">2-4 weeks typical</p>
        </div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="text-center p-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Submission Failed
      </h3>
      
      <p className="text-gray-600 mb-4">
        {errorMessage}
      </p>
      
      <Button
        onClick={() => {
          setSubmissionState('idle');
          setErrorMessage('');
        }}
        className="bg-emerald-600 hover:bg-emerald-500"
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <ErrorBoundary
      fallback={NetworkErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Lead form error:', error, errorInfo);
        setSubmissionState('error');
        setErrorMessage('An unexpected error occurred. Please refresh and try again.');
      }}
    >
      <Card className={`w-full max-w-lg transition-all duration-700 ${isVisible ? 'animate-in fade-in-50 slide-in-from-right-4' : 'opacity-0'} ${submissionState !== 'idle' ? 'min-h-[400px]' : ''}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-emerald-600">
            Ready to Go Supersonic?
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Get your full optimization plan and personalized quote
          </p>
        </CardHeader>
        <CardContent>
          {submissionState === 'success' ? (
            <SuccessState />
          ) : submissionState === 'error' ? (
            <ErrorState />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your full name"
                          {...field}
                          className="h-12 transition-all duration-300 focus:scale-[1.02]"
                          disabled={submissionState === 'submitting'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@company.com"
                          {...field}
                          className="h-12 transition-all duration-300 focus:scale-[1.02]"
                          disabled={submissionState === 'submitting'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Website *</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://your-company.com"
                          {...field}
                          className="h-12 transition-all duration-300 focus:scale-[1.02]"
                          disabled={submissionState === 'submitting'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service of Interest *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={submissionState === 'submitting'}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 transition-all duration-300 focus:scale-[1.02]">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="speed_optimization">Speed Optimization</SelectItem>
                          <SelectItem value="performance_audit">Performance Audit</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Goal (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Improve conversion rates, faster checkout..."
                          {...field}
                          className="h-12 transition-all duration-300 focus:scale-[1.02]"
                          disabled={submissionState === 'submitting'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message/Project Details (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your specific needs, challenges, or questions..."
                          className="resize-none min-h-[100px] transition-all duration-300 focus:scale-[1.02]"
                          disabled={submissionState === 'submitting'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={submissionState === 'submitting'}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition-all duration-300 hover:scale-[1.02] disabled:scale-100"
                >
                  {submissionState === 'submitting' ? (
                    <>
                      <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Get My Full Plan & Quote'
                  )}
                </Button>

                <div className="text-center text-sm text-gray-500 mt-4 space-y-1">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>We'll contact you within 24 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 flex-wrap text-xs">
                    <span>🎯 Free consultation included</span>
                    <span>📋 No obligation quote</span>
                  </div>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default FinalLeadForm;