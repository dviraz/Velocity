'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleUrlAnalysis, resetSession, type UrlAnalysisState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { LoaderCircle, AlertCircle, CheckCircle2, Globe, AlertTriangle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ProgressIndicator from '@/components/ui/progress-indicator';
import ErrorBoundary, { AnalysisErrorFallback } from '@/components/ui/error-boundary';

const initialUrlState: UrlAnalysisState = {
  message: '',
  isError: false,
};


type FormStep = 'url' | 'analysis' | 'success';

const FORM_STEPS = ['Enter URL', 'Analysis'];

const analysisSteps = [
  "Connecting...",
  "Analyzing page load performance...",
  "Measuring Core Web Vitals...",
  "Identifying speed bottlenecks...",
  "Compiling performance report..."
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
  console.log('🔧 AnalysisAnimation component received URL:', url);
  console.log('🔧 URL type:', typeof url, 'URL length:', url?.length, 'URL truthy:', !!url);
  console.log('🔧 URL detailed analysis:', {
    isNull: url === null,
    isUndefined: url === undefined,
    isEmpty: url === '',
    isWhitespace: url?.trim() === '',
    actualValue: JSON.stringify(url)
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  
  // More robust URL processing with better fallback
  let displayUrl = 'analyzing-your-website.com';
  if (url && typeof url === 'string' && url.trim().length > 0) {
    displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    console.log('🔧 ✅ URL successfully processed into displayUrl:', displayUrl);
  } else {
    console.log('🔧 ❌ URL failed validation, using generic fallback');
    console.log('🔧 ❌ Validation failed because:', {
      urlFalsy: !url,
      notString: typeof url !== 'string',
      emptyTrimmed: url?.trim?.()?.length === 0
    });
  }
  
  console.log('🔧 Display URL processed:', displayUrl, 'from original URL:', url);
  
  useEffect(() => {
    const maxSteps = analysisSteps.length;
    const stepDuration = 4500; // 4.5 seconds per step
    
    console.log('🔧 Starting animation with', maxSteps, 'steps for URL:', url);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev < maxSteps - 1 ? prev + 1 : prev;
        console.log('🔧 Moving from step', prev, 'to step', nextStep);
        return nextStep;
      });
    }, stepDuration);
    
    return () => {
      clearInterval(interval);
    };
  }, [url]);

  const currentMessage = analysisSteps[currentStep];
  const progressPercentage = Math.round(((currentStep + 1) / analysisSteps.length) * 100);
  
  console.log('🔧 Current step:', currentStep, 'Message:', currentMessage, 'Progress:', progressPercentage + '%');

  return (
    <div className="text-left p-6 bg-gray-900 rounded-lg animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      {/* PROMINENT DOMAIN BANNER */}
      <div className="bg-emerald-600 text-white py-4 px-6 rounded-lg mb-6 text-center border-4 border-emerald-400">
        <div className="text-sm text-emerald-100 mb-1">🔍 ANALYZING WEBSITE</div>
        <div className="text-2xl font-black">{displayUrl}</div>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <LoaderCircle className="h-6 w-6 text-emerald-500 animate-spin" />
        <div className="text-emerald-300 font-semibold text-lg">
          {currentStep === 0 ? (
            <>Connecting to <span className="text-white font-bold">{displayUrl}</span>...</>
          ) : (
            <>{currentMessage.replace('...', '')} for <span className="text-white font-bold">{displayUrl}</span>...</>
          )}
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Analysis Progress for {displayUrl}</span>
          <span className="font-bold text-emerald-400">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
        <div className="text-xs text-gray-400 mt-2">
          Step {currentStep + 1} of {analysisSteps.length}: {currentMessage}
        </div>
      </div>
    </div>
  );
}

const Hero = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>('url');
  const [urlState, urlFormAction] = useActionState(handleUrlAnalysis, initialUrlState);
  const [userUrl, setUserUrl] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Use a ref to ensure URL persists across re-renders
  const submittedUrlRef = useRef<string>('');
  
  console.log('🔧 Hero component render - currentStep:', currentStep, 'urlState:', {
    hasAnalysis: !!urlState.analysis,
    url: urlState.url,
    isError: urlState.isError
  });
  
  const urlFormRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Handle URL analysis completion and redirect to results
  useEffect(() => {
    console.log('🔧 useEffect triggered with urlState:', {
      hasAnalysis: !!urlState.analysis,
      isError: urlState.isError,
      currentStep,
      url: urlState.url
    });
    
    if (urlState.analysis && !urlState.isError) {
      console.log('🔧 Analysis completed, waiting 3 seconds before redirecting to results');
      // Give time to see the analysis animation with domain name
      setTimeout(() => {
        console.log('🔧 Starting transition to results');
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentStep('success');
          console.log('🔧 Moved to success step, will redirect shortly');
          setIsTransitioning(false);
          // Redirect to analysis results page
          setTimeout(() => {
            window.location.href = '/analysis-results';
          }, 2000);
        }, 300);
      }, 3000); // Wait 3 seconds before transitioning to success
    }
  }, [urlState.analysis, urlState.isError, currentStep]);

  // Handle URL form submission to track URL and start analysis animation
  const handleUrlSubmit = (formData: FormData) => {
    const url = formData.get('url') as string;
    console.log('🔧 📝 URL form submitted with value:', url);
    console.log('🔧 📝 FormData contents:', {
      url: formData.get('url'),
      allEntries: Array.from(formData.entries())
    });
    
    // Set both userUrl state and ref to ensure persistence
    setUserUrl(url);
    submittedUrlRef.current = url;
    console.log('🔧 📝 userUrl state set to:', url);
    console.log('🔧 📝 submittedUrlRef set to:', submittedUrlRef.current);
    console.log('🔧 📝 Current state before transition:', {
      currentStep,
      userUrl,
      urlStateUrl: urlState.url,
      urlStateAnalysis: !!urlState.analysis
    });
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('analysis');
      console.log('🔧 📝 Setting step to analysis, userUrl should be:', url);
      console.log('🔧 📝 Checking userUrl state after timeout:', userUrl);
      console.log('🔧 📝 Checking submittedUrlRef after timeout:', submittedUrlRef.current);
      setIsTransitioning(false);
    }, 300);
    
    console.log('🔧 📝 Calling urlFormAction with formData');
    urlFormAction(formData);
  };


  // Get current step number for progress indicator
  const getCurrentStepNumber = () => {
    switch (currentStep) {
      case 'url': return 1;
      case 'analysis': return 2;
      case 'success': return 2;
      default: return 1;
    }
  };

  // Handle session reset
  const handleReset = async () => {
    console.log('🔄 Resetting session and starting over...');
    await resetSession();
    setCurrentStep('url');
    setUserUrl('');
    setIsTransitioning(false);
    // Force page reload to clear all state
    window.location.reload();
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
          console.log('🔧 🎬 Rendering analysis step with:', {
            userUrl,
            urlStateUrl: urlState.url,
            submittedUrlRef: submittedUrlRef.current,
            userUrlType: typeof userUrl,
            userUrlLength: userUrl?.length,
            urlStateObject: urlState
          });
          
          // Enhanced URL selection with ref fallback
          let finalUrl = '';
          if (userUrl && userUrl.trim()) {
            finalUrl = userUrl;
            console.log('🔧 🎬 Using userUrl:', finalUrl);
          } else if (submittedUrlRef.current && submittedUrlRef.current.trim()) {
            finalUrl = submittedUrlRef.current;
            console.log('🔧 🎬 Using submittedUrlRef:', finalUrl);
          } else if (urlState.url && urlState.url.trim()) {
            finalUrl = urlState.url;
            console.log('🔧 🎬 Using urlState.url:', finalUrl);
          } else {
            console.log('🔧 🎬 ❌ All URL sources are empty/invalid');
            console.log('🔧 🎬 ❌ userUrl:', JSON.stringify(userUrl));
            console.log('🔧 🎬 ❌ submittedUrlRef:', JSON.stringify(submittedUrlRef.current));
            console.log('🔧 🎬 ❌ urlState.url:', JSON.stringify(urlState.url));
          }
          
          console.log('🔧 🎬 Final URL being passed to AnalysisAnimation:', finalUrl);
          return <AnalysisAnimation url={finalUrl} />;
          
          
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
              totalSteps={2}
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
              <span>Complete analysis</span>
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
