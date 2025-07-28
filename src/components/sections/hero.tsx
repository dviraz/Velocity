'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleAnalysis, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, LoaderCircle, Sparkles, AlertCircle, ShieldAlert, Zap, Rocket } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const initialState: FormState = {
  message: '',
  isError: false,
};

const issueIcons: Record<string, React.ReactNode> = {
    High: <AlertCircle className="h-5 w-5 text-red-500" />,
    Medium: <ShieldAlert className="h-5 w-5 text-yellow-500" />,
    Low: <Zap className="h-5 w-5 text-blue-500" />,
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base"
    >
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Get Free Analysis'
      )}
    </Button>
  );
}

const Hero = () => {
  const [state, formAction] = useFormState(handleAnalysis, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.message) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (!state.isError) {
        formRef.current?.reset();
      }
    }
  }, [state]);

  useEffect(() => {
    if (state.analysis?.performanceScore) {
      const targetScore = state.analysis.performanceScore;
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < targetScore) {
            return prev + 1;
          }
          clearInterval(interval);
          return targetScore;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [state.analysis?.performanceScore]);


  return (
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
        
        <div className="max-w-2xl mx-auto bg-gray-800/50 p-4 rounded-xl border border-gray-700 mb-12">
          <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-3"
          >
            <Input
              type="url"
              name="url"
              placeholder="Enter your website URL (e.g., https://example.com)"
              required
              className="w-full bg-gray-900 border-2 border-gray-600 focus:border-emerald-500 focus:ring-0 rounded-lg px-4 py-3 text-white placeholder-gray-500 transition-colors h-14 text-lg"
              aria-label="Website URL"
            />
            <Input
              type="email"
              name="email"
              placeholder="Enter your email to receive the analysis"
              required
              className="w-full bg-gray-900 border-2 border-gray-600 focus:border-emerald-500 focus:ring-0 rounded-lg px-4 py-3 text-white placeholder-gray-500 transition-colors h-14 text-lg"
              aria-label="Email Address"
            />
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
                'Get Free Analysis'
              )}
            </Button>
          </form>
          
          <div ref={resultRef} className="mt-4">
            {pending && !state.analysis && (
              <div className="text-left p-6 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <LoaderCircle className="h-5 w-5 text-white animate-spin" />
                  <p className="text-gray-300">Analyzing your website with Google PageSpeed Insights...</p>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            )}

            {state.isError && (
              <div className="text-left p-6 bg-red-900/50 rounded-lg border border-red-700">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <h4 className="text-lg font-bold text-red-300">Analysis Error</h4>
                </div>
                <p className="text-red-200">{state.message}</p>
              </div>
            )}

            {!state.isError && state.analysis && (
              <div className="text-left p-6 bg-gray-900 rounded-lg">
                <h4 className="text-xl font-bold text-white mb-2">PageSpeed Analysis Complete!</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Performance Grade</p>
                    <p className="text-4xl font-bold text-red-500">
                      {state.analysis.performanceScore >= 90 ? 'A' :
                       state.analysis.performanceScore >= 80 ? 'B' :
                       state.analysis.performanceScore >= 70 ? 'C' :
                       state.analysis.performanceScore >= 60 ? 'D' : 'F'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Performance Score</p>
                    <p className="text-4xl font-bold text-white">{progress}/100</p>
                  </div>
                </div>
                
                {/* Core Web Vitals Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">First Contentful Paint</p>
                    <p className="text-lg font-bold text-white">{(state.analysis.metrics.firstContentfulPaint / 1000).toFixed(1)}s</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Largest Contentful Paint</p>
                    <p className="text-lg font-bold text-white">{(state.analysis.metrics.largestContentfulPaint / 1000).toFixed(1)}s</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Cumulative Layout Shift</p>
                    <p className="text-lg font-bold text-white">{state.analysis.metrics.cumulativeLayoutShift}</p>
                  </div>
                </div>
                
                <div className="mb-4 p-4 bg-emerald-900/50 rounded-lg">
                  <p className="font-bold text-emerald-300">
                    Analysis Summary
                  </p>
                  <p className="text-sm text-emerald-400">{state.analysis.summary}</p>
                </div>

                {state.analysis.issues && state.analysis.issues.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="font-bold text-white">Optimization Opportunities:</h5>
                    {state.analysis.issues.map((issue) => (
                      <div 
                        key={issue.id} 
                        className="flex items-start gap-3 p-3 bg-gray-800 rounded border-l-4 border-gray-600"
                        style={{
                          borderLeftColor: issue.severity === 'High' ? '#ef4444' : 
                                          issue.severity === 'Medium' ? '#eab308' : '#3b82f6'
                        }}
                      >
                        {issueIcons[issue.severity]}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">{issue.title}</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              issue.severity === 'High' ? 'bg-red-500/20 text-red-300' :
                              issue.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-blue-500/20 text-blue-300'
                            }`}>
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">{issue.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button className="cta-button mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg">
                  <Link href="#contact">Get My Full Optimization Plan</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
