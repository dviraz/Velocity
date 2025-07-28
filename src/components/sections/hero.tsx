'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleUrlAnalysis, handleEmailSubmission, type UrlAnalysisState, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { LoaderCircle, AlertCircle, CheckCircle2, Globe, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ProgressIndicator from '@/components/ui/progress-indicator';
import ErrorBoundary, { AnalysisErrorFallback } from '@/components/ui/error-boundary';

const initialUrlState: UrlAnalysisState = {
  message: '',
  isError: false,
};

const initialEmailState: FormState = {
  message: '',
  isError: false,
};

type FormStep = 'url' | 'analysis' | 'email' | 'success';

const FORM_STEPS = ['Enter URL', 'Analysis', 'Enter Email'];

const analysisSteps = [
  "Connecting to your website...",
  "Analyzing for performance bottlenecks...",
  "Measuring Core Web Vitals...",
  "Scanning for conversion killers...",
  "Compiling your free report..."
];

function UrlSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="cta-button bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg text-lg h-14"
    >
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze My Website'
      )}
    </Button>
  );
}

function EmailSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="cta-button bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg text-lg h-14"
    >
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        'See My Results Now'
      )}
    </Button>
  );
}

function SuccessAnimation() {
  return (
    <div className="text-center p-6 bg-emerald-900/30 rounded-lg border border-emerald-700 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-emerald-600 rounded-full animate-bounce">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
      </div>
      <h4 className="text-xl font-bold text-emerald-300 mb-2">Perfect!</h4>
      <p className="text-emerald-200">
        You're being redirected to your results...
      </p>
    </div>
  );
}

function AnalysisAnimation({ url }: { url: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % analysisSteps.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-left p-6 bg-gray-900 rounded-lg animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <LoaderCircle className="h-6 w-6 text-emerald-500 animate-spin" />
        <p className="text-emerald-300 font-semibold">
          {analysisSteps[currentStep].replace("your website", url)}
        </p>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Analysis Progress</span>
          <span>{Math.round(((currentStep + 1) / analysisSteps.length) * 100)}%</span>
        </div>
        <Progress 
          value={((currentStep + 1) / analysisSteps.length) * 100} 
          className="h-2"
        />
      </div>
    </div>
  );
}

const Hero = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>('url');
  const [urlState, urlFormAction] = useFormState(handleUrlAnalysis, initialUrlState);
  const [emailState, emailFormAction] = useFormState(handleEmailSubmission, initialEmailState);
  const [userUrl, setUserUrl] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const urlFormRef = useRef<HTMLFormElement>(null);
  const emailFormRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Handle URL analysis completion with smooth transition
  useEffect(() => {
    if (urlState.analysis && !urlState.isError) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep('email');
        setIsTransitioning(false);
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [urlState.analysis, urlState.isError]);

  // Handle URL form submission to track URL and start analysis animation
  const handleUrlSubmit = (formData: FormData) => {
    const url = formData.get('url') as string;
    setUserUrl(url);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('analysis');
      setIsTransitioning(false);
    }, 300);
    urlFormAction(formData);
  };

  // Handle email form completion with success animation
  useEffect(() => {
    if (emailState.message && !emailState.isError) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep('success');
        setIsTransitioning(false);
        // The handleEmailSubmission action will redirect to /analysis-results
        emailFormRef.current?.reset();
      }, 300);
    }
  }, [emailState]);

  // Get current step number for progress indicator
  const getCurrentStepNumber = () => {
    switch (currentStep) {
      case 'url': return 1;
      case 'analysis': return 2;
      case 'email': return 2;
      case 'success': return 3;
      default: return 1;
    }
  };

  // Handle error retry
  const handleErrorRetry = () => {
    setCurrentStep('url');
    setUserUrl('');
    setIsTransitioning(false);
  };

  const renderStep = () => {
    const stepContent = (() => {
      switch (currentStep) {
        case 'url':
          return (
            <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-center mb-4">
                <div className="p-2 bg-emerald-600/20 rounded-full">
                  <Globe className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <form
                ref={urlFormRef}
                action={handleUrlSubmit}
                className="flex flex-col gap-3"
              >
                <Input
                  type="url"
                  name="url"
                  placeholder="your-website.com"
                  required
                  className="w-full bg-gray-900 border-2 border-gray-600 focus:border-emerald-500 focus:ring-0 rounded-lg px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 h-14 text-lg focus:scale-[1.02]"
                  aria-label="Website URL"
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    const value = target.value;
                    
                    // Auto-add https:// if no protocol is specified and value looks like a domain
                    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                      if (value.includes('.') && !value.includes(' ')) {
                        target.value = `https://${value}`;
                      }
                    }
                  }}
                />
                <UrlSubmitButton />
              </form>
            </div>
          );
          
        case 'analysis':
          return <AnalysisAnimation url={userUrl} />;
          
        case 'email':
          return (
            <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              <div className="text-left p-6 bg-emerald-900/50 rounded-lg border border-emerald-700 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  <h4 className="text-xl font-bold text-emerald-300">Success! Your performance analysis is ready.</h4>
                </div>
                <p className="text-emerald-200">
                  We&apos;ve completed a comprehensive analysis of {userUrl}. Enter your email below to instantly view your results.
                </p>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className="p-2 bg-emerald-600/20 rounded-full">
                  <Mail className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              
              <form
                ref={emailFormRef}
                action={emailFormAction}
                className="flex flex-col gap-3"
              >
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email to view results"
                  required
                  className="w-full bg-gray-900 border-2 border-gray-600 focus:border-emerald-500 focus:ring-0 rounded-lg px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 h-14 text-lg focus:scale-[1.02]"
                  aria-label="Email Address"
                />
                <EmailSubmitButton />
              </form>
            </div>
          );
          
        case 'success':
          return <SuccessAnimation />;
          
        default:
          return null;
      }
    })();

    return (
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {stepContent}
      </div>
    );
  };

  return (
    <ErrorBoundary
      fallback={AnalysisErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Hero section error:', error, errorInfo);
      }}
    >
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 swoosh-gradient"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            Losing Customers to a Slow Website?
          </h2>
          <p className="text-5xl md:text-6xl lg:text-7xl font-black hero-gradient-text mb-8">
            We Make It Blazing Fast.
          </p>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-12">
            Stop letting slow load times kill your conversions. Get a free, instant analysis and see how much faster your site could be.
          </p>
          
          {/* Progress Indicator */}
          <div className="mb-8">
            <ProgressIndicator
              currentStep={getCurrentStepNumber()}
              totalSteps={3}
              steps={FORM_STEPS}
            />
          </div>
          
          <div className="max-w-2xl mx-auto bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-12 backdrop-blur-sm">
            <div ref={resultRef}>
              {renderStep()}
              
              {/* Error states */}
              {urlState.isError && currentStep === 'analysis' && (
                <div className="text-left p-6 bg-red-900/50 rounded-lg border border-red-700 mt-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <h4 className="text-lg font-bold text-red-300">Analysis Error</h4>
                  </div>
                  <p className="text-red-200 mb-3">{urlState.message}</p>
                  <Button
                    onClick={handleErrorRetry}
                    className="bg-red-600 hover:bg-red-500 transition-all duration-300 hover:scale-105"
                  >
                    Try Again
                  </Button>
                </div>
              )}
              
              {emailState.isError && currentStep === 'email' && (
                <div className="text-left p-4 bg-red-900/50 rounded-lg border border-red-700 mt-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-red-200">{emailState.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Free analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>No sign-up required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Instant results</span>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default Hero;
