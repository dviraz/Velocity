'use client';

import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import PaypalButtons from '../paypal-buttons';
import { useToast } from '@/hooks/use-toast';

const pricingTiers = [
  {
    name: 'Starter',
    price: '499',
    description: 'For small sites or blogs that need a one-time speed boost.',
    features: [
      'Complete Performance Audit',
      'Image & Asset Optimization',
      'Caching Implementation',
      'Core Web Vitals Improvement',
      'Delivery in 5-7 business days'
    ],
  },
  {
    name: 'Business',
    price: '999',
    description: 'For established businesses and e-commerce stores.',
    features: [
      'Everything in Starter, plus:',
      'Advanced JavaScript/CSS Minification',
      'Database Optimization',
      'CDN Setup & Configuration',
      'Priority Support'
    ],
  },
   {
    name: 'Enterprise',
    price: '1999',
    description: 'For large-scale applications with custom needs.',
    features: [
      'Everything in Business, plus:',
      'Dedicated Performance Engineer',
      'Ongoing Monitoring & Reporting',
      'Custom Integrations',
      'Quarterly Performance Reviews'
    ],
  },
];

const Pricing = () => {
    const { toast } = useToast();

    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
        return (
            <section id="pricing" className="py-20 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                     <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                            Transparent Pricing for Every Need
                        </h2>
                        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                           To enable payments, please add your PayPal Client ID to the environment variables.
                        </p>
                    </div>
                </div>
            </section>
        )
    }

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, currency: 'USD', intent: 'capture' }}>
        <section id="pricing" className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                Transparent Pricing for Every Need
            </h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Choose the plan that fits your goals. Get world-class performance optimization with a one-time payment.
            </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
                <Card key={tier.name} className="flex flex-col rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <CardHeader className="p-8">
                        <CardTitle className="font-headline text-2xl font-bold">{tier.name}</CardTitle>
                        <CardDescription className="text-base h-12">{tier.description}</CardDescription>
                        <div className="text-4xl font-bold font-headline text-foreground pt-4">
                            ${tier.price}
                            <span className="text-lg font-medium text-muted-foreground"> / one-time</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 flex-1 flex flex-col">
                        <ul className="space-y-4 mb-8 flex-1">
                        {tier.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                        </ul>
                        <PaypalButtons 
                            amount={tier.price} 
                            onSuccess={(details) => {
                                toast({
                                    title: "Payment Successful!",
                                    description: `Thank you for your purchase, ${details.payer.name.given_name}. A confirmation has been sent to your email.`,
                                });
                            }}
                            onError={(err) => {
                                console.error('PayPal Error:', err);
                                toast({
                                    title: "Payment Error",
                                    description: "Something went wrong with the payment. Please try again.",
                                    variant: 'destructive'
                                });
                            }}
                        />
                    </CardContent>
                </Card>
            ))}
            </div>
        </div>
        </section>
    </PayPalScriptProvider>
  );
};

export default Pricing;
