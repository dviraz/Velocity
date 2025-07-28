'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoaderCircle } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  companyWebsite: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  service: z.enum(['speed_optimization', 'performance_audit', 'consulting', 'other'], {
    required_error: "Please select a service.",
  }),
  primaryGoal: z.string().min(3, { message: 'Please tell us your primary goal.' }).optional().or(z.literal('')),
  budget: z.enum(['lt_1k', '1k_5k', '5k_10k', 'gt_10k', 'not_sure']).optional(),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 1, name: 'Contact Details', fields: ['name', 'email', 'companyWebsite', 'service'] },
  { id: 2, name: 'Project Info', fields: ['primaryGoal', 'budget'] },
  { id: 3, name: 'Message', fields: ['message'] },
];

const ContactFormSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      companyWebsite: '',
      service: undefined,
      primaryGoal: '',
      budget: undefined,
      message: '',
    },
  });

  const next = async () => {
    const fields = steps[currentStep - 1].fields;
    const output = await form.trigger(fields as (keyof FormValues)[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length) {
      setCurrentStep(step => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 1) {
      setCurrentStep(step => step - 1);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(values);
    toast({
      title: 'Message Sent!',
      description: "Thanks for reaching out. We'll get back to you shortly.",
    });
    form.reset();
    setCurrentStep(1);
    setIsSubmitting(false);
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground leading-tight">
              Ready to Go Supersonic?
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
              Fill out the form to get in touch with our optimization experts. We&apos;re excited to help you achieve your performance goals and discuss a plan that fits your needs.
            </p>
            <div className="mt-8 flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep > index + 1 ? 'bg-primary text-primary-foreground' : currentStep === index + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {currentStep > index + 1 ? '✔' : step.id}
                  </div>
                  <p className={`ml-2 font-semibold ${currentStep === index + 1 ? 'text-primary' : 'text-muted-foreground'}`}>{step.name}</p>
                  {index < steps.length - 1 && <div className="w-12 h-px bg-border ml-4"></div>}
                </div>
              ))}
            </div>
          </div>
          <Card className="shadow-2xl rounded-xl">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {currentStep === 1 && (
                    <>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@company.com" {...field} />
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
                            <FormLabel>Company Website (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://your-company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service of Interest</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="speed_optimization">Website Speed Optimization</SelectItem>
                                <SelectItem value="performance_audit">Performance Audit</SelectItem>
                                <SelectItem value="consulting">Performance Consulting</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <FormField
                        control={form.control}
                        name="primaryGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What is your primary goal?</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Improve conversion rates" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Monthly Budget (Optional)</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="lt_1k" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    &lt; $1,000
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="1k_5k" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    $1,000 - $5,000
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="5k_10k" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    $5,000 - $10,000
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="gt_10k" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    &gt; $10,000
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="not_sure" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    I'm not sure
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {currentStep === 3 && (
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tell us about your project</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your project goals, current challenges, and any specific questions you have."
                              className="resize-none"
                              {...field}
                              rows={6}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="flex justify-between pt-2">
                    {currentStep > 1 && (
                      <Button type="button" onClick={prev} variant="outline">
                        Back
                      </Button>
                    )}
                    {currentStep < steps.length ? (
                      <Button type="button" onClick={next} className="ml-auto">
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting} className="ml-auto">
                        {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Submit
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
