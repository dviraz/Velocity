'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleAnalysis, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, LoaderCircle, Sparkles, AlertCircle, ShieldAlert, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
      className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
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
    <section className="py-20 md:py-32">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline text-foreground mb-4">
          Don't Let a Slow Website Cost You Customers
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Get an instant, AI-powered performance report. Discover exactly what's slowing you down and how to fix it—for free.
        </p>

        <form
          ref={formRef}
          action={formAction}
          className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 mb-8"
        >
          <Input
            type="url"
            name="url"
            placeholder="https://your-website.com"
            required
            className="h-14 text-lg"
            aria-label="Website URL"
          />
          <SubmitButton />
        </form>

        <div ref={resultRef} className="max-w-4xl mx-auto mt-8 text-left">
           {pending && !state.analysis && (
            <Card className="shadow-lg animate-pulse">
                <CardHeader>
                    <CardTitle>VelocityBot is analyzing your site...</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-8 w-1/2 rounded-md bg-muted mb-4" />
                    <div className="h-4 w-3/4 rounded-md bg-muted mb-2" />
                    <div className="h-4 w-full rounded-md bg-muted" />
                </CardContent>
            </Card>
           )}

          {state.isError && (
             <Alert variant="destructive" className="text-left">
              <Terminal className="h-4 w-4" />
              <AlertTitle className="font-bold font-headline">Analysis Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {!state.isError && state.analysis && (
            <Card className="shadow-xl">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="relative">
                             <Progress value={progress} className="w-40 h-40 rounded-full" style={{
                                background: `
                                    radial-gradient(closest-side, white 85%, transparent 86% 100%),
                                    conic-gradient(hsl(var(--primary)) ${progress}%, hsl(var(--muted)) 0)
                                `
                             }}/>
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-foreground">{progress}</span>
                                <span className="text-sm text-muted-foreground">/ 100</span>
                             </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <CardTitle className="font-headline text-2xl md:text-3xl">Performance Report</CardTitle>
                             <p className="text-muted-foreground mt-2">{state.analysis.summary}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <h3 className="font-headline font-bold text-xl mb-4">Actionable Insights</h3>
                     <Accordion type="single" collapsible className="w-full">
                        {state.analysis.issues?.map((issue) => (
                           <AccordionItem value={issue.id} key={issue.id}>
                                <AccordionTrigger>
                                    <div className="flex items-center gap-4">
                                        {issueIcons[issue.severity]}
                                        <span className="font-semibold">{issue.title}</span>
                                        <span className={`text-sm px-2 py-1 rounded-full ${
                                            issue.severity === 'High' ? 'bg-red-100 text-red-800' :
                                            issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {issue.severity}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pl-10">
                                   {issue.description}
                                </AccordionContent>
                           </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
