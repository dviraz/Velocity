'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleAnalysis, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, LoaderCircle, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

const initialState: FormState = {
  message: '',
  isError: false,
};

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
        'Analyze Site'
      )}
    </Button>
  );
}

const Hero = () => {
  const [state, formAction] = useFormState(handleAnalysis, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.message) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (!state.isError) {
        formRef.current?.reset();
      }
    }
  }, [state]);

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline text-foreground mb-4">
          Unlock Your Website&apos;s True Speed
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Enter your website URL to get an instant, AI-powered performance analysis and discover key areas for optimization.
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

        <div ref={resultRef} className="max-w-3xl mx-auto mt-8">
          {state.message && (
            <Alert variant={state.isError ? 'destructive' : 'default'} className="text-left">
              {state.isError ? <Terminal className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-primary" />}
              <AlertTitle className="font-bold font-headline">
                {state.isError ? 'Analysis Error' : 'Analysis Complete'}
              </AlertTitle>
              <AlertDescription>
                {state.analysis?.summary || state.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
